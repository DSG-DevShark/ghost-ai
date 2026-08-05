"use client"

import { PanelLeftClose, PanelLeftOpen, Share2, MessageSquare, LayoutTemplate } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

interface WorkspaceNavbarProps {
    projectName: string
    isSidebarOpen: boolean
    isAiSidebarOpen: boolean
    onToggleSidebar: () => void
    onToggleAiSidebar: () => void
    onOpenShare: () => void
    onOpenTemplates: () => void
}

export function WorkspaceNavbar({
    projectName,
    isSidebarOpen,
    isAiSidebarOpen,
    onToggleSidebar,
    onToggleAiSidebar,
    onOpenShare,
    onOpenTemplates,
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
                <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-xs text-copy-muted hover:text-copy-primary" onClick={onOpenTemplates}>
                    <LayoutTemplate className="h-4 w-4" />
                    Plantillas
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs" onClick={onOpenShare}>
                    <Share2 className="h-4 w-4" />
                    Compartir
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleAiSidebar}
                    className={`gap-1.5 h-8 text-xs transition-colors ${
                        isAiSidebarOpen
                            ? "text-ai-text bg-elevated hover:text-ai-text hover:bg-elevated"
                            : "text-copy-muted hover:text-copy-primary"
                    }`}
                >
                    <MessageSquare className="h-4 w-4" />
                    Asistente
                </Button>
                <UserButton />
            </div>
        </header>
    )
}
