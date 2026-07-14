"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { Button } from "@/components/ui/button"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { Project } from "@/app/generated/prisma/client"

interface EditorShellProps {
    ownedProjects: Project[]
    sharedProjects: Project[]
}

export function EditorShell({ ownedProjects, sharedProjects }: EditorShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const actions = useProjectActions()

    return (
        <div className="h-screen bg-base">
            <EditorNavbar
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
            />
            <ProjectSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                ownedProjects={ownedProjects}
                sharedProjects={sharedProjects}
                onCreateProject={actions.openCreate}
                onRenameProject={actions.openRename}
                onDeleteProject={actions.openDelete}
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
                    <Button onClick={actions.openCreate} className="gap-2 mt-2">
                        <Plus className="h-5 w-5" />
                        Nuevo proyecto
                    </Button>
                </div>
            </main>
            <ProjectDialogs
                dialogState={actions.dialogState}
                name={actions.name}
                roomIdPreview={actions.roomIdPreview}
                isLoading={actions.isLoading}
                onClose={actions.closeDialog}
                onNameChange={actions.setName}
                onCreate={actions.create}
                onRename={actions.rename}
                onDelete={actions.deleteProject}
            />
        </div>
    )
}
