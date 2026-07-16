import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getClerkIdentity } from '@/lib/project-access'
import { getClerkUserProfiles, getClerkUserProfileById } from '@/lib/clerk-users'
import type { NextRequest } from 'next/server'

export async function GET(
    _request: NextRequest,
    ctx: RouteContext<'/api/projects/[projectId]/collaborators'>
) {
    const identity = await getClerkIdentity()
    if (!identity) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { projectId } = await ctx.params

    const project = await prisma.project.findUnique({ where: { id: projectId } })
    if (!project) return Response.json({ error: 'Not found' }, { status: 404 })

    if (project.ownerId !== identity.userId) {
        if (!identity.email) return Response.json({ error: 'Forbidden' }, { status: 403 })
        const collab = await prisma.projectCollaborator.findUnique({
            where: { projectId_email: { projectId, email: identity.email } },
        })
        if (!collab) return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [collaborators, ownerProfile] = await Promise.all([
        prisma.projectCollaborator.findMany({
            where: { projectId },
            orderBy: { createdAt: 'asc' },
        }),
        getClerkUserProfileById(project.ownerId),
    ])

    const profiles = await getClerkUserProfiles(collaborators.map((c) => c.email))

    const ownerEntry = {
        id: project.ownerId,
        email: ownerProfile.email ?? '',
        name: ownerProfile.name,
        imageUrl: ownerProfile.imageUrl,
        createdAt: project.createdAt,
        role: 'owner' as const,
    }

    const collaboratorEntries = collaborators.map((c) => ({
        id: c.id,
        email: c.email,
        name: profiles.get(c.email)?.name ?? null,
        imageUrl: profiles.get(c.email)?.imageUrl ?? null,
        createdAt: c.createdAt,
        role: 'collaborator' as const,
    }))

    return Response.json([ownerEntry, ...collaboratorEntries])
}

export async function POST(
    request: NextRequest,
    ctx: RouteContext<'/api/projects/[projectId]/collaborators'>
) {
    const { userId } = await auth()
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { projectId } = await ctx.params

    const project = await prisma.project.findUnique({ where: { id: projectId } })
    if (!project) return Response.json({ error: 'Not found' }, { status: 404 })
    if (project.ownerId !== userId) return Response.json({ error: 'Forbidden' }, { status: 403 })

    let body: unknown
    try {
        body = await request.json()
    } catch {
        return Response.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const rawEmail = (body as Record<string, unknown>)?.email
    if (typeof rawEmail !== 'string' || !rawEmail.trim()) {
        return Response.json({ error: 'email is required' }, { status: 400 })
    }

    const email = rawEmail.trim().toLowerCase()

    const existing = await prisma.projectCollaborator.findUnique({
        where: { projectId_email: { projectId, email } },
    })
    if (existing) return Response.json({ error: 'Already a collaborator' }, { status: 409 })

    const collaborator = await prisma.projectCollaborator.create({
        data: { projectId, email },
    })

    return Response.json(collaborator, { status: 201 })
}
