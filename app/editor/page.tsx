"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { Button } from "@/components/ui/button"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"
import { MOCK_PROJECTS, toSlug, type Project } from "@/lib/mock-data"

export default function EditorPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS)
    const dialogs = useProjectDialogs()

    const handleCreate = (name: string) => {
        setProjects((prev) => [
            ...prev,
            { id: Date.now().toString(), name, slug: toSlug(name), isOwned: true },
        ])
    }

    const handleRename = (id: string, name: string) => {
        setProjects((prev) =>
            prev.map((p) => (p.id === id ? { ...p, name, slug: toSlug(name) } : p))
        )
    }

    const handleDelete = (id: string) => {
        setProjects((prev) => prev.filter((p) => p.id !== id))
    }

    return (
        <div className="h-screen bg-base">
            <EditorNavbar
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
            />
            <ProjectSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                projects={projects}
                onCreateProject={dialogs.openCreate}
                onRenameProject={dialogs.openRename}
                onDeleteProject={dialogs.openDelete}
            />
            <main className="pt-14 h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-center px-4">
                    <h1 className="text-2xl font-semibold text-copy-primary">
                        Crea un proyecto o abre uno existente
                    </h1>
                    <p className="text-sm text-copy-muted max-w-sm">
                        Empieza un nuevo espacio de trabajo de arquitectura, o elige un proyecto
                        desde la barra lateral.
                    </p>
                    <Button onClick={dialogs.openCreate} className="gap-2 mt-2">
                        <Plus className="h-5 w-5" />
                        Nuevo proyecto
                    </Button>
                </div>
            </main>
            <ProjectDialogs
                dialogState={dialogs.dialogState}
                name={dialogs.name}
                isLoading={dialogs.isLoading}
                onClose={dialogs.closeDialog}
                onNameChange={dialogs.setName}
                onCreate={() =>
                    dialogs.withLoading(() => handleCreate(dialogs.name))
                }
                onRename={() =>
                    dialogs.withLoading(() =>
                        handleRename(dialogs.dialogState.project!.id, dialogs.name)
                    )
                }
                onDelete={() =>
                    dialogs.withLoading(() => handleDelete(dialogs.dialogState.project!.id))
                }
            />
        </div>
    )
}
