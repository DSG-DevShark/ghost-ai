import { clerkClient } from '@clerk/nextjs/server'

export interface ClerkUserProfile {
    name: string | null
    imageUrl: string | null
}

export interface ClerkUserProfileWithEmail extends ClerkUserProfile {
    email: string | null
}

export async function getClerkUserProfileById(
    userId: string
): Promise<ClerkUserProfileWithEmail> {
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || null
    return {
        name,
        imageUrl: user.imageUrl ?? null,
        email: user.emailAddresses[0]?.emailAddress ?? null,
    }
}

const MAX_CLERK_LOOKUP = 500

export async function getClerkUserProfiles(
    emails: string[]
): Promise<Map<string, ClerkUserProfile>> {
    if (emails.length === 0) return new Map()

    const clerk = await clerkClient()
    const capped = emails.slice(0, MAX_CLERK_LOOKUP)
    const { data: users } = await clerk.users.getUserList({
        emailAddress: capped,
        limit: capped.length,
    })

    const map = new Map<string, ClerkUserProfile>()
    for (const user of users) {
        const matchedEmail = user.emailAddresses.find((e: { emailAddress: string }) =>
            capped.includes(e.emailAddress)
        )?.emailAddress
        if (!matchedEmail) continue

        const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || null
        map.set(matchedEmail, { name, imageUrl: user.imageUrl ?? null })
    }
    return map
}
