import { useState, type SubmitEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { authClient } from '../../lib/auth-client'
import { AuthLayout } from './AuthLayout'

export default function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const routeState = location.state as { from?: string } | null
    const requestedPath = routeState?.from

    const redirectTo =
        requestedPath?.startsWith('/') &&
            !requestedPath.startsWith('//')
            ? requestedPath
            : '/'

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        setErrorMessage('')
        setIsSubmitting(true)

        try {
            const { error } = await authClient.signIn.email({
                email: email.trim(),
                password,
            })

            if (error) {
                setErrorMessage(error.message ?? 'Unable to sign in. Please check your details and try again.')
                return
            }

            navigate(redirectTo, { replace: true })
        } catch {
            setErrorMessage(
                'Unable to connect to the server. Please try again.',
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AuthLayout
            title="Welcome back"
            description="Sign in to continue to your SalesFlow workspace."
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium"
                    >
                        Email address
                    </label>

                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                        placeholder="you@company.com"
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-medium"
                    >
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                        placeholder="Enter your password"
                    />
                </div>

                {errorMessage && (
                    <p
                        role="alert"
                        className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                    >
                        {errorMessage}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                Don't have an account?{' '}
                <Link
                    to="/register"
                    className="font-semibold text-cyan-700 hover:text-cyan-800"
                >
                    Create one
                </Link>
            </p>
        </AuthLayout>
    )
}
