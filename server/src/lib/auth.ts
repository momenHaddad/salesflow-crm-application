
import 'dotenv/config'

import { betterAuth } from 'better-auth'
import { prismaAdapter } from '@better-auth/prisma-adapter'
import { prisma } from './prisma.js'

const baseURL = process.env.BETTER_AUTH_URL
const secret = process.env.BETTER_AUTH_SECRET

if (!baseURL) {
    throw new Error('BETTER_AUTH_URL is not configured.')
}

if (!secret || secret.length < 32) {
    throw new Error(
        'BETTER_AUTH_SECRET must be configured with a secure secret.',
    )
}

export const auth = betterAuth({
    baseURL,
    secret,

    trustedOrigins: [
        process.env.CLIENT_URL ?? 'http://localhost:5173',
    ],

    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),

    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
    },
})
