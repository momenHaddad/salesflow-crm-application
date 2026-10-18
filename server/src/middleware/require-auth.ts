
import type { RequestHandler } from 'express'
import { fromNodeHeaders } from 'better-auth/node'
import { auth } from '../lib/auth.js'

export const requireAuth: RequestHandler = async (
    req,
    res,
    next,
) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        })

        if (!session) {
            res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'You must sign in to access this resource.',
                },
            })
            return
        }

        res.locals.authSession = session
        next()
    } catch (error) {
        next(error)
    }
}
