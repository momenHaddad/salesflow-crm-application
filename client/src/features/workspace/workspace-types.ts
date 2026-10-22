export type OrganizationRole = 'OWNER' | 'MANAGER' | 'SALES_REP'

export type OrganizationSummary = {
    id: string
    name: string
    slug: string
}

export type CurrentWorkspace = {
    organization: OrganizationSummary | null
    role: OrganizationRole | null
}

export const workspaceQueryKey = ['workspace', 'current'] as const
