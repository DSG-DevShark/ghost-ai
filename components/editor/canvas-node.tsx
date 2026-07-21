"use client"

import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { CanvasNode } from '@/types/canvas'
import { NODE_COLORS, DEFAULT_NODE_COLOR } from '@/types/canvas'

export function CanvasNodeComponent({ data }: NodeProps<CanvasNode>) {
    const colorPair = NODE_COLORS.find(c => c.fill === data.color) ?? DEFAULT_NODE_COLOR

    return (
        <div
            className="relative flex w-full h-full items-center justify-center rounded-xl border border-surface-border text-sm font-medium select-none"
            style={{ backgroundColor: colorPair.fill, color: colorPair.text }}
        >
            <Handle type="source" position={Position.Top} className="!opacity-0 hover:!opacity-100 !w-2 !h-2 !bg-white" />
            <Handle type="source" position={Position.Right} className="!opacity-0 hover:!opacity-100 !w-2 !h-2 !bg-white" />
            <Handle type="source" position={Position.Bottom} className="!opacity-0 hover:!opacity-100 !w-2 !h-2 !bg-white" />
            <Handle type="source" position={Position.Left} className="!opacity-0 hover:!opacity-100 !w-2 !h-2 !bg-white" />
            <span className="px-3 text-center leading-tight">{data.label}</span>
        </div>
    )
}
