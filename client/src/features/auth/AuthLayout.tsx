import type { PropsWithChildren } from 'react'
import { Activity } from 'lucide-react'
import { Link } from 'react-router'

type AuthLayoutProps = PropsWithChildren<{
    title: string
    description: string
}>

export function AuthLayout({
    title,
    description,
    children,
}: AuthLayoutProps) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-900">
            <div className="w-full max-w-md">
                <Link
                    to="/login"
                    className="mb-8 flex items-center justify-center gap-3 text-white"
                >
                    <span className="flex size-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950">
                        <Activity size={22} />
                    </span>

                    <span className="text-xl font-bold tracking-tight">
                        SalesFlow
                    </span>
                </Link>

                <section className="rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {title}
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        {description}
                    </p>

                    <div className="mt-6">{children}</div>
                </section>

                <p className="mt-6 text-center text-xs text-slate-400">
                    SalesFlow CRM · Development version
                </p>
            </div>
        </main>
    )
}
