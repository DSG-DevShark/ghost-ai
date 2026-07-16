import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getProjectWithAccess } from '@/lib/project-access'
import { getOwnedProjects, getSharedProjects } from '@/lib/projects'
import { AccessDenied } from '@/components/editor/access-denied'
import { WorkspaceShell } from '@/components/editor/workspace-shell'

interface WorkspacePageProps {
    params: Promise<{ roomId: string }>
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
    const { userId } = await auth()
    if (!userId) redirect('/sign-in')

    const { roomId } = await params

    const [project, ownedProjects, sharedProjects] = await Promise.all([
        getProjectWithAccess(roomId),
        getOwnedProjects(),
        getSharedProjects(),
    ])

    if (!project) return <AccessDenied />

    return (
        <WorkspaceShell
            project={project}
            ownedProjects={ownedProjects}
            sharedProjects={sharedProjects}
            isOwner={project.ownerId === userId}
        />
    )
}
