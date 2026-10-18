import { useState, type SubmitEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { authClient } from '../../lib/auth-client'
import { AuthLayout } from './AuthLayout'

export default function RegisterPage() {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        setErrorMessage('')

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.')
            return
        }

        if (password.length < 8) {
            setErrorMessage('Password must contain at least 8 characters.')
            return
        }

        setIsSubmitting(true)

        try {
            const { error } = await authClient.signUp.email({
                name: name.trim(),
                email: email.trim(),
                password,
            })

            if (error) {
                setErrorMessage(error.message || 'Unable to create account. Please check your details and try again.')
                return
            }

            // Better Auth automatically signs users in after
            // successful registration with our current configuration.
            navigate('/', { replace: true })
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
            title="Create your account"
            description="Start organizing your customer relationships with SalesFlow."
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium"
                    >
                        Full name
                    </label>

                    <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        required
                        maxLength={100}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                        placeholder="Your full name"
                    />
                </div>

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
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
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
                        autoComplete="new-password"
                        required
                        minLength={8}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                        placeholder="At least 8 characters"
                    />
                </div>

                <div>
                    <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-sm font-medium"
                    >
                        Confirm password
                    </label>

                    <input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                        placeholder="Enter your password again"
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
                    {isSubmitting ? 'Creating account...' : 'Create account'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link
                    to="/login"
                    className="font-semibold text-cyan-700 hover:text-cyan-800"
                >
                    Sign in
                </Link>
            </p>
        </AuthLayout>
    )
}
