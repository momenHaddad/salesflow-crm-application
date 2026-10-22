import { useEffect, useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate} from 'react-router'
import { apiRequest, ApiRequestError } from '../../lib/api-client'
import type { CurrentWorkspace } from './workspace-types'
import { workspaceQueryKey } from './workspace-types'
import { authClient } from '../../lib/auth-client'

export default function WorkspaceOnboardingPage() {
    const [name, setName] = useState('')
    const [isSigningOut, setIsSigningOut] = useState(false)
    const [signOutError, setSignOutError] = useState('')
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const currentWorkspace = useQuery({
        queryKey: workspaceQueryKey,
        queryFn: () =>
            apiRequest<CurrentWorkspace>('/api/organizations/current'),
        retry: false,
    })

    const createWorkspace = useMutation({
        mutationFn: (workspaceName: string) =>
            apiRequest<CurrentWorkspace>('/api/organizations', {
                method: 'POST',
                body: JSON.stringify({ name: workspaceName }),
            }),

        onSuccess: (data) => {
            queryClient.setQueryData(workspaceQueryKey, data)
            navigate('/', { replace: true })
        },
    })

    useEffect(() => {
        if (currentWorkspace.data?.organization) {
            navigate('/', { replace: true })
        }
    }, [currentWorkspace.data, navigate])

    if (currentWorkspace.isPending) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
                Checking your workspace...
            </main>
        )
    }

    if (currentWorkspace.isError) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
                <section className="max-w-md">
                    <h1 className="text-xl font-semibold">
                        Unable to load your workspace
                    </h1>
                    <p className="mt-2 text-sm text-slate-300">
                        Make sure the SalesFlow API is running, then try again.
                    </p>
                    <button
                        type="button"
                        onClick={() => void currentWorkspace.refetch()}
                        className="mt-5 rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950"
                    >
                        Try again
                    </button>
                </section>
            </main>
        )
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        createWorkspace.mutate(name.trim())
    }

    const mutationError = createWorkspace.error
    const errorMessage =
        mutationError instanceof ApiRequestError
            ? mutationError.message
            : mutationError instanceof Error
                ? mutationError.message
                : null

    async function handleSignOut() {
        setSignOutError('')
        setIsSigningOut(true)

        try {
            const { error } = await authClient.signOut()

            if (error) {
                setSignOutError(error.message || 'Unable to sign out. Please try again.')
                return
            }

            // Remove cached data associated with the signed-in user.
            queryClient.clear()

            navigate('/login', { replace: true })
        } catch {
            setSignOutError('Unable to sign out. Please try again.')
        } finally {
            setIsSigningOut(false)
        }
    }                
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
            <section className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
                    SalesFlow CRM
                </p>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                    Create your workspace
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                    Give your team a shared place to manage companies, contacts,
                    leads, and deals.
                </p>

                <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                    <div>
                        <label
                            htmlFor="workspaceName"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Business or workspace name
                        </label>

                        <input
                            id="workspaceName"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                            minLength={2}
                            maxLength={80}
                            autoComplete="organization"
                            placeholder="e.g. Acme Technologies"
                            className="w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                        />
                    </div>

                    {errorMessage && (
                        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            {errorMessage}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={createWorkspace.isPending || name.trim().length < 2}
                        className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {createWorkspace.isPending
                            ? 'Creating workspace...'
                            : 'Create workspace'}
                    </button>
                </form>


                <div className="mt-6 border-t border-slate-200 pt-5 text-center">
                    {signOutError && (
                        <p
                            role="alert"
                            className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                        >
                            {signOutError}
                        </p>
                    )}

                    <p className="text-sm text-slate-500">
                        Signed in to the wrong account?
                    </p>

                    <button
                        type="button"
                        onClick={() => void handleSignOut()}
                        disabled={isSigningOut}
                        className="mt-2 rounded-lg px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSigningOut ? 'Signing out...' : 'Sign out and return to login'}
                    </button>
                </div>

            </section>
        </main>
    )
}
