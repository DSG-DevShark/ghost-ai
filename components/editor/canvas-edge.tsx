"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import {
    EdgeLabelRenderer,
    getSmoothStepPath,
    useReactFlow,
    type EdgeProps,
} from '@xyflow/react'
import type { CanvasEdge } from '@/types/canvas'

export function CanvasEdgeComponent({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    selected,
    data,
}: EdgeProps<CanvasEdge>) {
    const { updateEdgeData } = useReactFlow()
    const [isEditing, setIsEditing] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const editStartRef = useRef<string>('')

    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    })

    const label = data?.label ?? ''
    const isHighlighted = selected || isEditing

    const strokeColor = isHighlighted
        ? 'rgba(248,250,252,0.80)'
        : 'rgba(248,250,252,0.30)'

    const markerId = `ghost-arrow-${id}`

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus()
            inputRef.current?.select()
        }
    }, [isEditing])

    const openEdit = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        editStartRef.current = label
        setIsEditing(true)
    }, [label])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        updateEdgeData(id, { label: e.target.value })
    }, [id, updateEdgeData])

    const handleBlur = useCallback(() => {
        setIsEditing(false)
    }, [])

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation()
        if (e.key === 'Enter') {
            setIsEditing(false)
        }
        if (e.key === 'Escape') {
            updateEdgeData(id, { label: editStartRef.current })
            setIsEditing(false)
        }
    }, [id, updateEdgeData])

    const inputWidth = Math.max(label.length * 8, 60)

    return (
        <>
            <defs>
                <marker
                    id={markerId}
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="5"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                >
                    <path d="M0,0 L0,10 L10,5 z" fill="rgba(248,250,252,0.80)" />
                </marker>
            </defs>
            {/* Wide invisible hit area for easier click/hover */}
            <path
                d={edgePath}
                fill="none"
                stroke="transparent"
                strokeWidth={16}
                className="react-flow__edge-interaction"
                onDoubleClick={openEdit}
            />
            {/* Visible edge path */}
            <path
                id={id}
                d={edgePath}
                fill="none"
                stroke={strokeColor}
                strokeWidth={1.5}
                strokeLinecap="round"
                markerEnd={`url(#${markerId})`}
                style={{ transition: 'stroke 150ms ease' }}
                className="react-flow__edge-path"
                onDoubleClick={openEdit}
            />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan"
                    onDoubleClick={openEdit}
                >
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={label}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            onMouseDown={e => e.stopPropagation()}
                            onClick={e => e.stopPropagation()}
                            placeholder="Label..."
                            style={{ width: inputWidth }}
                            className="nodrag nopan px-2 py-0.5 text-xs rounded-full border border-white/20 bg-elevated text-copy-primary outline-none text-center min-w-[60px]"
                        />
                    ) : label ? (
                        <span className="px-2 py-0.5 text-xs rounded-full border border-white/15 bg-elevated text-copy-secondary select-none cursor-default">
                            {label}
                        </span>
                    ) : isHighlighted ? (
                        <span className="px-2 py-0.5 text-xs rounded-full border border-white/10 bg-elevated text-copy-faint opacity-40 select-none cursor-default">
                            Label
                        </span>
                    ) : null}
                </div>
            </EdgeLabelRenderer>
        </>
    )
}
