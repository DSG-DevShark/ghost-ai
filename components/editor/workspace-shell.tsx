"use client"

import { Component, useState, useCallback } from "react"
import { BrainCircuit } from "lucide-react"
import { LiveblocksProvider, RoomProvider } from '@liveblocks/react'
import { ReactFlowProvider } from '@xyflow/react'
import { WorkspaceNavbar } from "@/components/editor/workspace-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ShareDialog } from "@/components/editor/share-dialog"
import { StarterTemplatesModal } from "@/components/editor/starter-templates-modal"
import { CanvasWrapper } from "@/components/editor/canvas-wrapper"
import { CanvasControlBar } from "@/components/editor/canvas-control-bar"
import { ShapePanel } from "@/components/editor/shape-panel"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { Project } from "@/app/generated/prisma/client"
import type { CanvasTemplate } from "@/components/editor/starter-templates"

class LiveblocksErrorBoundary extends Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-copy-faint">No se pudo conectar al canvas.</p>
                </div>
            )
        }
        return this.props.children
    }
}

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
    const [isTemplatesOpen, setIsTemplatesOpen] = useState(false)
    const [pendingTemplate, setPendingTemplate] = useState<CanvasTemplate | null>(null)
    const actions = useProjectActions()

    const handleImportTemplate = useCallback((template: CanvasTemplate) => {
        setPendingTemplate(template)
        setIsTemplatesOpen(false)
    }, [])

    return (
        <LiveblocksErrorBoundary>
            <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
                <RoomProvider
                    id={project.id}
                    initialPresence={{ cursor: null, isThinking: false }}
                >
                    <ReactFlowProvider>
                        <div className="h-screen bg-base">
                            <WorkspaceNavbar
                                projectName={project.name}
                                isSidebarOpen={isSidebarOpen}
                                isAiSidebarOpen={isAiSidebarOpen}
                                onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
                                onToggleAiSidebar={() => setIsAiSidebarOpen((prev) => !prev)}
                                onOpenShare={() => setIsShareOpen(true)}
                                onOpenTemplates={() => setIsTemplatesOpen(true)}
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

                            <main className={`pt-14 h-full transition-[margin] duration-300 ease-in-out ${isAiSidebarOpen ? "mr-80" : "mr-0"}`}>
                                <CanvasWrapper
                                    pendingTemplate={pendingTemplate}
                                    onTemplateImported={() => setPendingTemplate(null)}
                                />
                            </main>

                            <div className={`fixed bottom-6 z-30 transition-[margin] duration-300 ease-in-out ${isSidebarOpen ? "ml-72" : "ml-6"}`}>
                                <CanvasControlBar />
                            </div>

                            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
                                <ShapePanel />
                            </div>

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

                            <StarterTemplatesModal
                                open={isTemplatesOpen}
                                onOpenChange={setIsTemplatesOpen}
                                onImport={handleImportTemplate}
                            />
                        </div>
                    </ReactFlowProvider>
                </RoomProvider>
            </LiveblocksProvider>
        </LiveblocksErrorBoundary>
    )
}
