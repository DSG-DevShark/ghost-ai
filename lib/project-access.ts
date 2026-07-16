import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import type { Project } from '@/app/generated/prisma/client'

export interface ClerkIdentity {
    userId: string
    email: string | null
}

export async function getClerkIdentity(): Promise<ClerkIdentity | null> {
    const user = await currentUser()
    if (!user) return null
    return {
        userId: user.id,
        email: user.emailAddresses[0]?.emailAddress ?? null,
    }
}

export async function getProjectWithAccess(projectId: string): Promise<Project | null> {
    const identity = await getClerkIdentity()
    if (!identity) return null

    const project = await prisma.project.findUnique({ where: { id: projectId } })
    if (!project) return null

    if (project.ownerId === identity.userId) return project

    if (identity.email) {
        const collab = await prisma.projectCollaborator.findUnique({
            where: { projectId_email: { projectId: project.id, email: identity.email } },
        })
        if (collab) return project
    }

    return null
}
