import { Liveblocks } from '@liveblocks/node'

const CURSOR_COLORS = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E9',
]

export function getUserColor(userId: string): string {
    let hash = 0
    for (const char of userId) {
        hash = ((hash << 5) - hash) + char.charCodeAt(0)
        hash |= 0
    }
    return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length]
}

const globalForLiveblocks = globalThis as unknown as { liveblocks: Liveblocks | undefined }

export function getLiveblocks(): Liveblocks {
    if (globalForLiveblocks.liveblocks) return globalForLiveblocks.liveblocks

    const secret = process.env.LIVEBLOCKS_SECRET_KEY
    if (!secret) throw new Error('LIVEBLOCKS_SECRET_KEY is not set')

    const client = new Liveblocks({ secret })

    if (process.env.NODE_ENV !== 'production') {
        globalForLiveblocks.liveblocks = client
    }

    return client
}
