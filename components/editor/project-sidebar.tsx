"use client"

import { X, Plus } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

interface ProjectSidebarProps {
    isOpen: boolean
    onClose: () => void
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
    return (
        <aside
            className={`fixed top-14 left-0 z-40 flex h-[calc(100vh-3.5rem)] w-72 flex-col bg-surface border-r border-surface-border transition-transform duration-300 ease-in-out ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
                <span className="text-sm font-medium text-copy-primary">Proyectos</span>
                <button
                    onClick={onClose}
                    className="rounded-xl p-1 text-copy-muted hover:text-copy-primary hover:bg-elevated transition-colors"
                    aria-label="Cerrar barra lateral"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <Tabs defaultValue="my-projects" className="flex flex-1 flex-col min-h-0 px-3 pt-3">
                <TabsList className="w-full">
                    <TabsTrigger value="my-projects" className="flex-1">Mis proyectos</TabsTrigger>
                    <TabsTrigger value="shared" className="flex-1">Compartidos</TabsTrigger>
                </TabsList>
                <TabsContent value="my-projects" className="flex flex-1 items-center justify-center">
                    <p className="text-sm text-copy-muted">Aún no tienes proyectos.</p>
                </TabsContent>
                <TabsContent value="shared" className="flex flex-1 items-center justify-center">
                    <p className="text-sm text-copy-muted">Sin proyectos compartidos.</p>
                </TabsContent>
            </Tabs>

            <div className="p-3 border-t border-surface-border">
                <Button className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo proyecto
                </Button>
            </div>
        </aside>
    )
}
