import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import { z } from 'zod'

import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/require-auth.js'

const organizationRouter = Router()

const createOrganizationSchema = z.object({
    name: z.string().trim().min(2).max(80),
})

organizationRouter.get('/current', requireAuth, async (_req, res, next) => {
    try {
        const userId = res.locals.authSession.user.id as string

        const membership = await prisma.organizationMembership.findFirst({
            where: { userId },
            include: { organization: true },
            orderBy: [
                { createdAt: 'asc' },
                { id: 'asc' },
            ],
        })

        res.status(200).json({
            success: true,
            data: {
                organization: membership?.organization ?? null,
                role: membership?.role ?? null,
            },
        })
    } catch (error) {
        next(error)
    }
})

organizationRouter.post('/', requireAuth, async (req, res, next) => {
    try {
        const result = createOrganizationSchema.safeParse(req.body)

        if (!result.success) {
            res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Workspace name must contain between 2 and 80 characters.',
                },
            })
            return
        }

        const userId = res.locals.authSession.user.id as string

        // Version 1: one initial workspace per user.
        const existingMembership =
            await prisma.organizationMembership.findFirst({
                where: { userId },
                select: { id: true },
            })

        if (existingMembership) {
            res.status(409).json({
                success: false,
                error: {
                    code: 'WORKSPACE_ALREADY_EXISTS',
                    message: 'Your account already belongs to a workspace.',
                },
            })
            return
        }

        const name = result.data.name

        const baseSlug =
            name
                .normalize('NFKD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')
                .slice(0, 40) || 'workspace'

        const slug = `${baseSlug}-${randomUUID().replace(/-/g, '').slice(0, 8)}`

        const created = await prisma.$transaction(async (tx) => {
            const organization = await tx.organization.create({
                data: {
                    name,
                    slug,
                },
            })

            const membership = await tx.organizationMembership.create({
                data: {
                    organizationId: organization.id,
                    userId,
                    role: 'OWNER',
                },
            })

            return {
                organization,
                role: membership.role,
            }
        })

        res.status(201).json({
            success: true,
            data: created,
        })
    } catch (error) {
        next(error)
    }
})

export default organizationRouter
