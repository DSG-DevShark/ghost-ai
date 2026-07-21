"use client"

import {
    ReactFlow,
    Background,
    BackgroundVariant,
    MiniMap,
    ConnectionMode,
    ReactFlowProvider,
    useReactFlow,
} from '@xyflow/react'
import { useLiveblocksFlow } from '@liveblocks/react-flow'
import type { CanvasNode, CanvasEdge, ShapeType } from '@/types/canvas'
import { DEFAULT_NODE_COLOR } from '@/types/canvas'
import { CanvasNodeComponent } from '@/components/editor/canvas-node'
import '@xyflow/react/dist/style.css'

const nodeTypes = { canvasNode: CanvasNodeComponent }

let dropCounter = 0

interface ShapePayload {
    shape: ShapeType
    width: number
    height: number
}

function InnerCanvas() {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
        useLiveblocksFlow<CanvasNode, CanvasEdge>({ suspense: true })

    const { screenToFlowPosition } = useReactFlow()

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
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDelete={onDelete}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            connectionMode={ConnectionMode.Loose}
            fitView
        >
            <Background variant={BackgroundVariant.Dots} />
            <MiniMap />
        </ReactFlow>
    )
}

export function Canvas() {
    return (
        <ReactFlowProvider>
            <InnerCanvas />
        </ReactFlowProvider>
    )
}
