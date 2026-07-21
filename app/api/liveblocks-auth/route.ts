import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getLiveblocks, getUserColor } from '@/lib/liveblocks'
import { getProjectWithAccess } from '@/lib/project-access'

export async function POST(request: NextRequest) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as { room?: unknown }
    const room = typeof body.room === 'string' ? body.room : null
    if (!room) {
        return NextResponse.json({ error: 'Missing room' }, { status: 400 })
    }

    const project = await getProjectWithAccess(room)
    if (!project) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const user = await currentUser()
    const name = user?.fullName ?? user?.emailAddresses[0]?.emailAddress ?? 'Unknown'
    const avatar = user?.imageUrl ?? ''
    const color = getUserColor(userId)

    const client = getLiveblocks()
    await client.getOrCreateRoom(room, { defaultAccesses: [] })

    const session = client.prepareSession(userId, {
        userInfo: { name, avatar, color },
    })
    session.allow(room, ['*:write'])

    const { body: token, status } = await session.authorize()
    return new NextResponse(token, { status })
}
