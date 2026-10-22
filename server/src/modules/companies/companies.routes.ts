
import { Router, type Response } from 'express'
import { z } from 'zod'

import { prisma } from '../../lib/prisma.js'
import { requireAuth } from '../../middleware/require-auth.js'

const companiesRouter = Router()

const optionalText = (maxLength: number) =>
    z
        .string()
        .trim()
        .max(maxLength)
        .or(z.null())
        .optional()
        .transform((value) => (value === '' ? null : value))

const optionalWebsite = z
    .string()
    .trim()
    .url()
    .or(z.literal(''))
    .or(z.null())
    .optional()
    .transform((value) => (value === '' ? null : value))

const optionalEmail = z
    .string()
    .trim()
    .email()
    .or(z.literal(''))
    .or(z.null())
    .optional()
    .transform((value) => (value === '' ? null : value))

const createCompanySchema = z.object({
    name: z.string().trim().min(2).max(120),
    industry: optionalText(100),
    website: optionalWebsite,
    email: optionalEmail,
    phone: optionalText(40),
})

const updateCompanySchema = createCompanySchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: 'Provide at least one field to update.',
    })

const listCompaniesSchema = z.object({
    q: z.string().trim().max(100).optional().default(''),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
    sortBy: z
        .enum(['name', 'createdAt', 'updatedAt'])
        .default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

type AuthenticatedSession = {
    user: {
        id: string
    }
}

function getUserId(res: Response): string {
    return (res.locals as { authSession: AuthenticatedSession }).authSession.user.id
}

async function getOrganizationId(userId: string) {
    const membership = await prisma.organizationMembership.findFirst({
        where: { userId },
        orderBy: [
            { createdAt: 'asc' },
            { id: 'asc' },
        ],
        select: {
            organizationId: true,
        },
    })

    return membership?.organizationId ?? null
}

function workspaceRequired(res: import('express').Response) {
    return res.status(403).json({
        success: false,
        error: {
            code: 'WORKSPACE_REQUIRED',
            message: 'Create or join a workspace to manage companies.',
        },
    })
}

// GET /api/v1/companies
companiesRouter.get('/', requireAuth, async (req, res, next) => {
    try {
        const query = listCompaniesSchema.safeParse(req.query)

        if (!query.success) {
            res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_QUERY',
                    message: 'The search or pagination parameters are invalid.',
                },
            })
            return
        }

        const userId = getUserId(res)
        const organizationId = await getOrganizationId(userId)

        if (!organizationId) {
            workspaceRequired(res)
            return
        }

        const { q, page, pageSize, sortBy, sortOrder } = query.data

        const where = {
            organizationId,
            ...(q
                ? {
                    OR: [
                        {
                            name: {
                                contains: q,
                                mode: 'insensitive' as const,
                            },
                        },
                        {
                            industry: {
                                contains: q,
                                mode: 'insensitive' as const,
                            },
                        },
                        {
                            email: {
                                contains: q,
                                mode: 'insensitive' as const,
                            },
                        },
                    ],
                }
                : {}),
        }

        const orderBy =
            sortBy === 'name'
                ? { name: sortOrder }
                : sortBy === 'updatedAt'
                    ? { updatedAt: sortOrder }
                    : { createdAt: sortOrder }

        const [companies, total] = await Promise.all([
            prisma.company.findMany({
                where,
                orderBy,
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.company.count({ where }),
        ])

        res.status(200).json({
            success: true,
            data: {
                companies,
                pagination: {
                    page,
                    pageSize,
                    total,
                    totalPages: Math.ceil(total / pageSize),
                },
            },
        })
    } catch (error) {
        next(error)
    }
})

// GET /api/v1/companies/:id
companiesRouter.get('/:id', requireAuth, async (req, res, next) => {
    try {
        const companyId = req.params.id

        if (typeof companyId !== 'string') {
            res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_COMPANY_ID',
                    message: 'The company ID is invalid.',
                },
            })
            return
        }

        const userId = getUserId(res)
        const organizationId = await getOrganizationId(userId)

        if (!organizationId) {
            workspaceRequired(res)
            return
        }

        const company = await prisma.company.findFirst({
            where: {
                id: companyId,
                organizationId,
            },
        })

        if (!company) {
            res.status(404).json({
                success: false,
                error: {
                    code: 'COMPANY_NOT_FOUND',
                    message: 'Company not found.',
                },
            })
            return
        }

        res.status(200).json({
            success: true,
            data: { company },
        })
    } catch (error) {
        next(error)
    }
})

// POST /api/v1/companies
companiesRouter.post('/', requireAuth, async (req, res, next) => {
    try {
        const parsed = createCompanySchema.safeParse(req.body)

        if (!parsed.success) {
            res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Check the company information and try again.',
                    details: parsed.error.flatten().fieldErrors,
                },
            })
            return
        }

        const userId = getUserId(res)
        const organizationId = await getOrganizationId(userId)

        if (!organizationId) {
            workspaceRequired(res)
            return
        }

        const company = await prisma.company.create({
            data: {
                ...parsed.data,
                organizationId,
            },
        })

        res.status(201).json({
            success: true,
            data: { company },
        })
    } catch (error) {
        next(error)
    }
})

// PATCH /api/v1/companies/:id
companiesRouter.patch('/:id', requireAuth, async (req, res, next) => {
    try {
        const companyId = req.params.id

        if (typeof companyId !== 'string') {
            res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_COMPANY_ID',
                    message: 'The company ID is invalid.',
                },
            })
            return
        }

        const parsed = updateCompanySchema.safeParse(req.body)

        if (!parsed.success) {
            res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Provide valid company information.',
                    details: parsed.error.flatten().fieldErrors,
                },
            })
            return
        }

        const userId = getUserId(res)
        const organizationId = await getOrganizationId(userId)

        if (!organizationId) {
            workspaceRequired(res)
            return
        }

        const result = await prisma.company.updateMany({
            where: {
                id: companyId,
                organizationId,
            },
            data: parsed.data,
        })

        if (result.count === 0) {
            res.status(404).json({
                success: false,
                error: {
                    code: 'COMPANY_NOT_FOUND',
                    message: 'Company not found.',
                },
            })
            return
        }

        const company = await prisma.company.findFirst({
            where: {
                id: companyId,
                organizationId,
            },
        })

        res.status(200).json({
            success: true,
            data: { company },
        })
    } catch (error) {
        next(error)
    }
})

// DELETE /api/v1/companies/:id
companiesRouter.delete('/:id', requireAuth, async (req, res, next) => {
    try {
        const companyId = req.params.id

        if (typeof companyId !== 'string') {
            res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_COMPANY_ID',
                    message: 'The company ID is invalid.',
                },
            })
            return
        }

        const userId = getUserId(res)
        const organizationId = await getOrganizationId(userId)

        if (!organizationId) {
            workspaceRequired(res)
            return
        }

        const result = await prisma.company.deleteMany({
            where: {
                id: companyId,
                organizationId,
            },
        })

        if (result.count === 0) {
            res.status(404).json({
                success: false,
                error: {
                    code: 'COMPANY_NOT_FOUND',
                    message: 'Company not found.',
                },
            })
            return
        }

        res.status(200).json({
            success: true,
            data: {
                id: companyId,
                deleted: true,
            },
        })
    } catch (error) {
        next(error)
    }
})

export default companiesRouter
