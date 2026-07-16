"use client"

import { useState } from "react"
import { BrainCircuit } from "lucide-react"
import { WorkspaceNavbar } from "@/components/editor/workspace-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ShareDialog } from "@/components/editor/share-dialog"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { Project } from "@/app/generated/prisma/client"

interface WorkspaceShellProps {
    project: Project
    ownedProjects: Project[]
    sharedProjects: Project[]
    isOwner: boolean
}

export function WorkspaceShell({ project, ownedProjects, sharedProjects, isOwner }: WorkspaceShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false)
    const [isShareOpen, setIsShareOpen] = useState(false)
    const actions = useProjectActions()

    return (
        <div className="h-screen bg-base">
            <WorkspaceNavbar
                projectName={project.name}
                isSidebarOpen={isSidebarOpen}
                isAiSidebarOpen={isAiSidebarOpen}
                onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
                onToggleAiSidebar={() => setIsAiSidebarOpen((prev) => !prev)}
                onOpenShare={() => setIsShareOpen(true)}
            />

            <ProjectSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                ownedProjects={ownedProjects}
                sharedProjects={sharedProjects}
                activeProjectId={project.id}
                onCreateProject={actions.openCreate}
                onRenameProject={actions.openRename}
                onDeleteProject={actions.openDelete}
            />

            <main className="pt-14 h-full flex items-center justify-center">
                <p className="text-sm text-copy-faint">
                    El canvas de diseño aparecerá aquí.
                </p>
            </main>

            <aside
                className={`fixed top-14 right-0 z-40 flex h-[calc(100vh-3.5rem)] w-80 flex-col bg-surface border-l border-surface-border transition-transform duration-300 ease-in-out ${
                    isAiSidebarOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col flex-1 items-center justify-center gap-3 text-center px-6">
                    <BrainCircuit className="h-8 w-8 text-copy-faint" />
                    <p className="text-sm text-copy-faint">
                        El asistente de IA aparecerá aquí.
                    </p>
                </div>
            </aside>

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

            <ShareDialog
                open={isShareOpen}
                onOpenChange={setIsShareOpen}
                projectId={project.id}
                isOwner={isOwner}
            />
        </div>
    )
}
