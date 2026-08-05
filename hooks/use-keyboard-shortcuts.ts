"use client"

import { useEffect } from 'react'
import type { ReactFlowInstance } from '@xyflow/react'
import type { CanvasNode, CanvasEdge } from '@/types/canvas'

const ZOOM_DURATION = 300

function isEditableTarget(): boolean {
    const el = document.activeElement
    if (!el) return false
    const tag = el.tagName.toLowerCase()
    return tag === 'input' || tag === 'textarea' || (el as HTMLElement).isContentEditable
}

interface UseKeyboardShortcutsOptions {
    flow: ReactFlowInstance<CanvasNode, CanvasEdge>
    undo: () => void
    redo: () => void
}

export function useKeyboardShortcuts({ flow, undo, redo }: UseKeyboardShortcutsOptions): void {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (isEditableTarget()) return

            const ctrl = e.ctrlKey || e.metaKey

            if (!ctrl && e.key === '+') {
                e.preventDefault()
                flow.zoomIn({ duration: ZOOM_DURATION })
                return
            }
            if (!ctrl && e.key === '-') {
                e.preventDefault()
                flow.zoomOut({ duration: ZOOM_DURATION })
                return
            }
            if (ctrl && e.shiftKey && e.key.toLowerCase() === 'z') {
                e.preventDefault()
                redo()
                return
            }
            if (ctrl && !e.shiftKey && e.key.toLowerCase() === 'z') {
                e.preventDefault()
                undo()
                return
            }
        }

        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [flow, undo, redo])
}
