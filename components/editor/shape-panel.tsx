"use client"

import { Square, Diamond, Circle, Pill, Cylinder, Hexagon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ShapeType } from '@/types/canvas'
import { SHAPE_DEFAULT_SIZES } from '@/types/canvas'

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

export function ShapePanel() {
    const handleDragStart = (e: React.DragEvent, shape: ShapeType) => {
        const { width, height } = SHAPE_DEFAULT_SIZES[shape]
        e.dataTransfer.setData(
            'application/ghost-shape',
            JSON.stringify({ shape, width, height }),
        )
        e.dataTransfer.effectAllowed = 'copy'
    }

    return (
        <div className="flex items-center gap-1 px-3 py-2 rounded-full border border-surface-border bg-elevated shadow-lg">
            {SHAPES.map(({ shape, Icon, label }) => (
                <button
                    key={shape}
                    draggable
                    onDragStart={e => handleDragStart(e, shape)}
                    title={label}
                    className="flex items-center justify-center w-8 h-8 rounded-xl text-copy-muted hover:text-copy-primary hover:bg-subtle transition-colors cursor-grab active:cursor-grabbing"
                >
                    <Icon className="w-4 h-4" />
                </button>
            ))}
        </div>
    )
}
