import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import type { Project } from '@/app/generated/prisma/client'

export async function getOwnedProjects(): Promise<Project[]> {
    const { userId } = await auth()
    if (!userId) return []
    return prisma.project.findMany({
        where: { ownerId: userId },
        orderBy: { createdAt: 'desc' },
    })
}

export async function getSharedProjects(): Promise<Project[]> {
    const user = await currentUser()
    if (!user) return []
    const email = user.emailAddresses[0]?.emailAddress
    if (!email) return []
    const collaborations = await prisma.projectCollaborator.findMany({
        where: { email },
        include: { project: true },
        orderBy: { createdAt: 'desc' },
    })
    return collaborations.map((c) => c.project)
}
