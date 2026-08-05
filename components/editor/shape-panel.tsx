"use client"

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Square, Diamond, Circle, Pill, Cylinder, Hexagon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ShapeType } from '@/types/canvas'
import { SHAPE_DEFAULT_SIZES, DEFAULT_NODE_COLOR } from '@/types/canvas'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ShapeEntry {
    shape: ShapeType
    Icon: LucideIcon
    label: string
}

const SHAPES: ShapeEntry[] = [
    { shape: 'rectangle', Icon: Square, label: 'Rectangle' },
    { shape: 'diamond', Icon: Diamond, label: 'Diamond' },
    { shape: 'circle', Icon: Circle, label: 'Circle' },
    { shape: 'pill', Icon: Pill, label: 'Pill' },
    { shape: 'cylinder', Icon: Cylinder, label: 'Cylinder' },
    { shape: 'hexagon', Icon: Hexagon, label: 'Hexagon' },
]

interface DragPreviewState {
    shape: ShapeType
    width: number
    height: number
    x: number
    y: number
}

function PreviewShape({ shape, fill, stroke }: { shape: ShapeType; fill: string; stroke: string }) {
    if (shape === 'diamond') {
        return (
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden>
                <polygon points="50,3 97,50 50,97 3,50" fill={fill} stroke={stroke} strokeWidth="1.5" />
            </svg>
        )
    }
    if (shape === 'hexagon') {
        return (
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden>
                <polygon points="97,50 74,9 27,9 3,50 27,91 74,91" fill={fill} stroke={stroke} strokeWidth="1.5" />
            </svg>
        )
    }
    if (shape === 'cylinder') {
        return (
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden>
                <ellipse cx="50" cy="75" rx="48" ry="18" fill={fill} stroke={stroke} strokeWidth="1.5" />
                <rect x="2" y="22" width="96" height="53" fill={fill} />
                <line x1="2" y1="22" x2="2" y2="75" stroke={stroke} strokeWidth="1.5" />
                <line x1="98" y1="22" x2="98" y2="75" stroke={stroke} strokeWidth="1.5" />
                <ellipse cx="50" cy="22" rx="48" ry="18" fill={fill} stroke={stroke} strokeWidth="1.5" />
            </svg>
        )
    }
    return (
        <div
            className="absolute inset-0 border"
            style={{
                backgroundColor: fill,
                borderColor: stroke,
                borderRadius: shape === 'rectangle' ? '12px' : '9999px',
            }}
        />
    )
}

function DragGhost({ shape, width, height, x, y }: DragPreviewState) {
    return (
        <div
            className="fixed pointer-events-none z-[9999] opacity-60"
            style={{ left: x - width / 2, top: y - height / 2, width, height }}
        >
            <div className="relative w-full h-full">
                <PreviewShape
                    shape={shape}
                    fill={DEFAULT_NODE_COLOR.fill}
                    stroke="rgba(255,255,255,0.45)"
                />
            </div>
        </div>
    )
}

export function ShapePanel() {
    const [dragPreview, setDragPreview] = useState<DragPreviewState | null>(null)

    const handleDragStart = (e: React.DragEvent, shape: ShapeType) => {
        const { width, height } = SHAPE_DEFAULT_SIZES[shape]
        e.dataTransfer.setData(
            'application/ghost-shape',
            JSON.stringify({ shape, width, height }),
        )
        e.dataTransfer.effectAllowed = 'copy'

        // Replace browser's default drag ghost with an invisible element
        const phantom = document.createElement('div')
        phantom.style.position = 'fixed'
        phantom.style.top = '-9999px'
        document.body.appendChild(phantom)
        e.dataTransfer.setDragImage(phantom, 0, 0)
        requestAnimationFrame(() => document.body.removeChild(phantom))

        setDragPreview({ shape, width, height, x: e.clientX, y: e.clientY })

        const onDragOver = (ev: DragEvent) => {
            ev.preventDefault()
            setDragPreview(prev => prev ? { ...prev, x: ev.clientX, y: ev.clientY } : null)
        }

        const onDragEnd = () => {
            setDragPreview(null)
            window.removeEventListener('dragover', onDragOver)
            window.removeEventListener('dragend', onDragEnd)
        }

        window.addEventListener('dragover', onDragOver)
        window.addEventListener('dragend', onDragEnd)
    }

    return (
        <>
            <TooltipProvider delayDuration={400}>
                <div className="flex items-center gap-1 px-3 py-2 rounded-full border border-surface-border bg-elevated shadow-lg">
                    {SHAPES.map(({ shape, Icon, label }) => (
                        <Tooltip key={shape}>
                            <TooltipTrigger asChild>
                                <button
                                    draggable
                                    onDragStart={e => handleDragStart(e, shape)}
                                    aria-label={label}
                                    className="flex items-center justify-center w-8 h-8 rounded-xl text-copy-muted hover:text-copy-primary hover:bg-subtle transition-colors cursor-grab active:cursor-grabbing"
                                >
                                    <Icon className="w-4 h-4" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="rounded-xl text-xs px-2.5 py-1 border-surface-border">
                                {label}
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </TooltipProvider>
            {dragPreview && createPortal(<DragGhost {...dragPreview} />, document.body)}
        </>
    )
}
