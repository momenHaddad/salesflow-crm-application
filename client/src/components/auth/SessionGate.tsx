import { Navigate, Outlet, useLocation } from 'react-router'
import { authClient } from '../../lib/auth-client'

type SessionGateProps = {
    requireAuth: boolean
}

export function SessionGate({ requireAuth }: SessionGateProps) {
    const location = useLocation()

    const {
        data: session,
        isPending,
        error,
        refetch,
    } = authClient.useSession()

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-sm text-slate-500">
                    Checking your session...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
                <div className="max-w-md text-center">
                    <h1 className="text-xl font-semibold">
                        Unable to verify your session
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Check that the SalesFlow API is running, then try again.
                    </p>

                    <button
                        onClick={() => void refetch()}
                        className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                    >
                        Try again
                    </button>
                </div>
            </div>
        )
    }

    if (requireAuth && !session) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        )
    }

    if (!requireAuth && session) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}
