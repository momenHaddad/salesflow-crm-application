
type FeaturePlaceholderProps = {
    title: string
    description: string
}

export function FeaturePlaceholder({
    title,
    description,
}: FeaturePlaceholderProps) {
    return (
        <section className="space-y-6">
            <div>
                <p className="text-sm font-medium text-cyan-700">
                    WORKSPACE
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    {title}
                </h1>

                <p className="mt-2 text-slate-500">{description}</p>
            </div>

            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <h2 className="font-semibold">Coming in a future milestone</h2>

                <p className="mt-2 text-sm text-slate-500">
                    This section will become a functional CRM module as we build
                    the application step by step.
                </p>
            </div>
        </section>
    )
}
