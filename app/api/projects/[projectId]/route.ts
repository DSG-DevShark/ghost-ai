import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'

export async function PATCH(
    request: NextRequest,
    ctx: RouteContext<'/api/projects/[projectId]'>
) {
    const { userId } = await auth()
    if (!userId) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId } = await ctx.params

    const project = await prisma.project.findUnique({ where: { id: projectId } })
    if (!project) {
        return Response.json({ error: 'Not found' }, { status: 404 })
    }
    if (project.ownerId !== userId) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    let body: unknown
    try {
        body = await request.json()
    } catch {
        return Response.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const rawName = (body as Record<string, unknown>)?.name
    if (typeof rawName !== 'string' || !rawName.trim()) {
        return Response.json({ error: 'name is required' }, { status: 400 })
    }

    const updated = await prisma.project.update({
        where: { id: projectId },
        data: { name: rawName.trim() },
    })

    return Response.json(updated)
}

export async function DELETE(
    _request: NextRequest,
    ctx: RouteContext<'/api/projects/[projectId]'>
) {
    const { userId } = await auth()
    if (!userId) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId } = await ctx.params

    const project = await prisma.project.findUnique({ where: { id: projectId } })
    if (!project) {
        return Response.json({ error: 'Not found' }, { status: 404 })
    }
    if (project.ownerId !== userId) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.project.delete({ where: { id: projectId } })

    return new Response(null, { status: 204 })
}
