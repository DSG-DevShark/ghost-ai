"use client"

import { ClientSideSuspense } from '@liveblocks/react'
import { Canvas } from '@/components/editor/canvas'
import type { CanvasTemplate } from '@/components/editor/starter-templates'

interface CanvasWrapperProps {
    pendingTemplate?: CanvasTemplate | null
    onTemplateImported?: () => void
}

export function CanvasWrapper({ pendingTemplate, onTemplateImported }: CanvasWrapperProps) {
    return (
        <ClientSideSuspense
            fallback={
                <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-copy-faint">Cargando canvas…</p>
                </div>
            }
        >
            <Canvas pendingTemplate={pendingTemplate} onTemplateImported={onTemplateImported} />
        </ClientSideSuspense>
    )
}
