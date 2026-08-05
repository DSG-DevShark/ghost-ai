"use client"

import { Minus, Plus, Maximize2, Undo2, Redo2 } from 'lucide-react'
import { useReactFlow } from '@xyflow/react'
import { useUndo, useRedo, useCanUndo, useCanRedo } from '@liveblocks/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const ZOOM_DURATION = 300

interface ControlButtonProps {
    onClick: () => void
    disabled?: boolean
    label: string
    children: React.ReactNode
}

function ControlButton({ onClick, disabled, label, children }: ControlButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    onClick={onClick}
                    disabled={disabled}
                    aria-label={label}
                    className="flex items-center justify-center w-8 h-8 rounded-xl text-copy-secondary hover:text-copy-primary hover:bg-subtle transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-copy-secondary"
                >
                    {children}
                </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="rounded-xl text-xs px-2.5 py-1 border-surface-border">
                {label}
            </TooltipContent>
        </Tooltip>
    )
}

export function CanvasControlBar() {
    const { zoomIn, zoomOut, fitView } = useReactFlow()
    const undo = useUndo()
    const redo = useRedo()
    const canUndo = useCanUndo()
    const canRedo = useCanRedo()

    return (
        <TooltipProvider delayDuration={400}>
            <div className="flex items-center gap-1 px-3 py-2 rounded-full border border-surface-border bg-elevated shadow-lg">
                <ControlButton onClick={() => zoomOut({ duration: ZOOM_DURATION })} label="Zoom out (-)">
                    <Minus className="w-4 h-4" />
                </ControlButton>
                <ControlButton onClick={() => fitView({ duration: ZOOM_DURATION })} label="Ajustar vista">
                    <Maximize2 className="w-4 h-4" />
                </ControlButton>
                <ControlButton onClick={() => zoomIn({ duration: ZOOM_DURATION })} label="Zoom in (+)">
                    <Plus className="w-4 h-4" />
                </ControlButton>

                <div className="w-px h-5 bg-border-default mx-1 shrink-0" />

                <ControlButton onClick={undo} disabled={!canUndo} label="Deshacer (Ctrl+Z)">
                    <Undo2 className="w-4 h-4" />
                </ControlButton>
                <ControlButton onClick={redo} disabled={!canRedo} label="Rehacer (Ctrl+Shift+Z)">
                    <Redo2 className="w-4 h-4" />
                </ControlButton>
            </div>
        </TooltipProvider>
    )
}
