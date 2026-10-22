import { useQuery } from '@tanstack/react-query'
import { Navigate, Outlet } from 'react-router'
import { apiRequest } from '../../lib/api-client'
import type { CurrentWorkspace } from '../../features/workspace/workspace-types'
import { workspaceQueryKey } from '../../features/workspace/workspace-types'

export function WorkspaceGate() {
    const workspace = useQuery({
        queryKey: workspaceQueryKey,
        queryFn: () =>
            apiRequest<CurrentWorkspace>('/api/organizations/current'),
        retry: false,
    })

    if (workspace.isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
                Loading workspace...
            </div>
        )
    }

    if (workspace.isError) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-6">
                <p className="text-sm text-slate-600">
                    We couldn't load your workspace.
                </p>
                <button
                    type="button"
                    onClick={() => void workspace.refetch()}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                    Try again
                </button>
            </div>
        )
    }

    if (!workspace.data.organization) {
        return <Navigate to="/onboarding" replace />
    }

    return <Outlet />
}
