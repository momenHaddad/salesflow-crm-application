import { createAuthClient } from 'better-auth/react'

const baseURL =
    import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export const authClient = createAuthClient({
    baseURL,
})

export type AuthSession = typeof authClient.$Infer.Session
