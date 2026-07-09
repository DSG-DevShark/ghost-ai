"use client"

import { X, Plus, Pencil, Trash2 } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import type { Project } from "@/lib/mock-data"

interface ProjectSidebarProps {
    isOpen: boolean
    onClose: () => void
    projects: Project[]
    onCreateProject: () => void
    onRenameProject: (project: Project) => void
    onDeleteProject: (project: Project) => void
}

export function ProjectSidebar({
    isOpen,
    onClose,
    projects,
    onCreateProject,
    onRenameProject,
    onDeleteProject,
}: ProjectSidebarProps) {
    const ownedProjects = projects.filter((p) => p.isOwned)
    const sharedProjects = projects.filter((p) => !p.isOwned)

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

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
                        <TabsTrigger value="my-projects" className="flex-1">
                            Mis proyectos
                        </TabsTrigger>
                        <TabsTrigger value="shared" className="flex-1">
                            Compartidos
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="my-projects" className="flex flex-1 flex-col min-h-0 mt-2">
                        {ownedProjects.length === 0 ? (
                            <div className="flex flex-1 items-center justify-center">
                                <p className="text-sm text-copy-muted">
                                    Aún no tienes proyectos.
                                </p>
                            </div>
                        ) : (
                            <ul className="flex flex-col gap-0.5 overflow-y-auto">
                                {ownedProjects.map((project) => (
                                    <ProjectItem
                                        key={project.id}
                                        project={project}
                                        onRename={onRenameProject}
                                        onDelete={onDeleteProject}
                                    />
                                ))}
                            </ul>
                        )}
                    </TabsContent>

                    <TabsContent value="shared" className="flex flex-1 flex-col min-h-0 mt-2">
                        {sharedProjects.length === 0 ? (
                            <div className="flex flex-1 items-center justify-center">
                                <p className="text-sm text-copy-muted">
                                    Sin proyectos compartidos.
                                </p>
                            </div>
                        ) : (
                            <ul className="flex flex-col gap-0.5 overflow-y-auto">
                                {sharedProjects.map((project) => (
                                    <ProjectItem key={project.id} project={project} />
                                ))}
                            </ul>
                        )}
                    </TabsContent>
                </Tabs>

                <div className="p-3 border-t border-surface-border">
                    <Button onClick={onCreateProject} className="w-full gap-2">
                        <Plus className="h-4 w-4" />
                        Crear proyecto
                    </Button>
                </div>
            </aside>
        </>
    )
}

interface ProjectItemProps {
    project: Project
    onRename?: (project: Project) => void
    onDelete?: (project: Project) => void
}

function ProjectItem({ project, onRename, onDelete }: ProjectItemProps) {
    return (
        <li className="group flex items-center gap-1 px-2 py-2 rounded-xl hover:bg-elevated transition-colors cursor-pointer">
            <span className="flex-1 text-sm text-copy-primary truncate">{project.name}</span>
            {(onRename || onDelete) && (
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onRename && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onRename(project)
                            }}
                            className="p-1 rounded-lg hover:bg-subtle transition-colors"
                            aria-label={`Renombrar ${project.name}`}
                        >
                            <Pencil className="h-3.5 w-3.5 text-copy-muted" />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete(project)
                            }}
                            className="p-1 rounded-lg hover:bg-subtle transition-colors group/del"
                            aria-label={`Eliminar ${project.name}`}
                        >
                            <Trash2 className="h-3.5 w-3.5 text-copy-muted group-hover/del:text-error transition-colors" />
                        </button>
                    )}
                </div>
            )}
        </li>
    )
}
