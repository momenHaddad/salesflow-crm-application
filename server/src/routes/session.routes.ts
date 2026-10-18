
import { Router } from 'express'
import { requireAuth } from '../middleware/require-auth.js'

const sessionRouter = Router()

sessionRouter.get('/me', requireAuth, (_req, res) => {
    const session = res.locals.authSession

    res.status(200).json({
        success: true,
        data: {
            user: session.user,
        },
    })
})

export default sessionRouter
