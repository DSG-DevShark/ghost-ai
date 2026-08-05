"use client"

import { useEffect, useRef } from 'react'
import {
    ReactFlow,
    Background,
    BackgroundVariant,
    MiniMap,
    ConnectionMode,
    useReactFlow,
} from '@xyflow/react'
import { useLiveblocksFlow } from '@liveblocks/react-flow'
import { useUndo, useRedo, useHistory } from '@liveblocks/react'
import type { CanvasNode, CanvasEdge, ShapeType } from '@/types/canvas'
import { DEFAULT_NODE_COLOR } from '@/types/canvas'
import { CanvasNodeComponent } from '@/components/editor/canvas-node'
import { CanvasEdgeComponent } from '@/components/editor/canvas-edge'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import type { CanvasTemplate } from '@/components/editor/starter-templates'
import '@xyflow/react/dist/style.css'

const nodeTypes = { canvasNode: CanvasNodeComponent }
const edgeTypes = { canvasEdge: CanvasEdgeComponent }

const defaultEdgeOptions = {
    type: 'canvasEdge',
}

let dropCounter = 0

interface ShapePayload {
    shape: ShapeType
    width: number
    height: number
}

interface InnerCanvasProps {
    pendingTemplate?: CanvasTemplate | null
    onTemplateImported?: () => void
}

function InnerCanvas({ pendingTemplate, onTemplateImported }: InnerCanvasProps) {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
        useLiveblocksFlow<CanvasNode, CanvasEdge>({ suspense: true })

    const flow = useReactFlow<CanvasNode, CanvasEdge>()
    const undo = useUndo()
    const redo = useRedo()
    const lbHistory = useHistory()
    useKeyboardShortcuts({ flow, undo, redo })

    // Keep refs to avoid stale closures in the import effect
    const nodesRef = useRef(nodes)
    const edgesRef = useRef(edges)
    useEffect(() => { nodesRef.current = nodes }, [nodes])
    useEffect(() => { edgesRef.current = edges }, [edges])

    useEffect(() => {
        if (!pendingTemplate) return

        const template = pendingTemplate
        onTemplateImported?.()

        // Pause history so delete + adds become one single undo step.
        lbHistory.pause()
        onDelete({ nodes: nodesRef.current, edges: edgesRef.current })

        setTimeout(() => {
            onNodesChange(template.nodes.map(nd => ({ type: 'add' as const, item: nd })))
            onEdgesChange(template.edges.map(eg => ({ type: 'add' as const, item: eg })))
            lbHistory.resume()
            setTimeout(() => flow.fitView({ padding: 0.12, duration: 350 }), 80)
        }, 60)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingTemplate])

    const { screenToFlowPosition } = flow

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const raw = e.dataTransfer.getData('application/ghost-shape')
        if (!raw) return

        let payload: ShapePayload
        try {
            payload = JSON.parse(raw) as ShapePayload
        } catch {
            return
        }

        const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })
        dropCounter++
        const id = `${payload.shape}-${Date.now()}-${dropCounter}`

        const newNode: CanvasNode = {
            id,
            type: 'canvasNode',
            position: {
                x: position.x - payload.width / 2,
                y: position.y - payload.height / 2,
            },
            width: payload.width,
            height: payload.height,
            data: {
                label: '',
                color: DEFAULT_NODE_COLOR.fill,
                shape: payload.shape,
            },
        }

        onNodesChange([{ type: 'add', item: newNode }])
    }

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDelete={onDelete}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            connectionMode={ConnectionMode.Loose}
            isValidConnection={(conn) => conn.source !== conn.target}
            proOptions={{ hideAttribution: true }}
            fitView
        >
            <Background variant={BackgroundVariant.Dots} />
            <MiniMap
                style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                }}
                nodeColor={(node) => (node.data as { color: string }).color}
                nodeStrokeWidth={0}
                maskColor="rgba(0, 200, 212, 0.08)"
            />
        </ReactFlow>
    )
}

interface CanvasProps {
    pendingTemplate?: CanvasTemplate | null
    onTemplateImported?: () => void
}

export function Canvas({ pendingTemplate, onTemplateImported }: CanvasProps) {
    return <InnerCanvas pendingTemplate={pendingTemplate} onTemplateImported={onTemplateImported} />
}
