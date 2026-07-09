"use client"

import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { UserButton } from "@clerk/nextjs"

interface EditorNavbarProps {
    isSidebarOpen: boolean
    onToggleSidebar: () => void
}

export function EditorNavbar({ isSidebarOpen, onToggleSidebar }: EditorNavbarProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center px-3 bg-surface border-b border-surface-border">
            <div className="flex items-center">
                <button
                    onClick={onToggleSidebar}
                    className="rounded-xl p-2 text-copy-muted hover:text-copy-primary hover:bg-elevated transition-colors"
                    aria-label={isSidebarOpen ? "Cerrar barra lateral" : "Abrir barra lateral"}
                >
                    {isSidebarOpen
                        ? <PanelLeftClose className="h-5 w-5" />
                        : <PanelLeftOpen className="h-5 w-5" />
                    }
                </button>
            </div>
            <div className="flex-1" />
            <div className="flex items-center">
                <UserButton />
            </div>
        </header>
    )
}
