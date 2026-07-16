"use client"

import { PanelLeftClose, PanelLeftOpen, Share2, MessageSquare } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

interface WorkspaceNavbarProps {
    projectName: string
    isSidebarOpen: boolean
    isAiSidebarOpen: boolean
    onToggleSidebar: () => void
    onToggleAiSidebar: () => void
    onOpenShare: () => void
}

export function WorkspaceNavbar({
    projectName,
    isSidebarOpen,
    isAiSidebarOpen,
    onToggleSidebar,
    onToggleAiSidebar,
    onOpenShare,
}: WorkspaceNavbarProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center px-3 gap-3 bg-surface border-b border-surface-border">
            <button
                onClick={onToggleSidebar}
                className="rounded-xl p-2 text-copy-muted hover:text-copy-primary hover:bg-elevated transition-colors shrink-0"
                aria-label={isSidebarOpen ? "Cerrar barra lateral" : "Abrir barra lateral"}
            >
                {isSidebarOpen
                    ? <PanelLeftClose className="h-5 w-5" />
                    : <PanelLeftOpen className="h-5 w-5" />
                }
            </button>

            <span className="flex-1 text-sm font-medium text-copy-primary truncate">
                {projectName}
            </span>

            <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs" onClick={onOpenShare}>
                    <Share2 className="h-4 w-4" />
                    Compartir
                </Button>
                <button
                    onClick={onToggleAiSidebar}
                    className={`rounded-xl p-2 transition-colors ${
                        isAiSidebarOpen
                            ? "text-ai-text bg-elevated"
                            : "text-copy-muted hover:text-copy-primary hover:bg-elevated"
                    }`}
                    aria-label={isAiSidebarOpen ? "Cerrar AI" : "Abrir AI"}
                >
                    <MessageSquare className="h-5 w-5" />
                </button>
                <UserButton />
            </div>
        </header>
    )
}
