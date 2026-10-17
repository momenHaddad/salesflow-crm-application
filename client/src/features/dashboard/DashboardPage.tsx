
import {
    Activity,
    BriefcaseBusiness,
    CalendarDays,
    Users,
} from 'lucide-react'

const metrics = [
    {
        label: 'New leads',
        icon: Users,
        description: 'New potential customers',
    },
    {
        label: 'Open deals',
        icon: BriefcaseBusiness,
        description: 'Active sales opportunities',
    },
    {
        label: 'Pipeline value',
        icon: Activity,
        description: 'Value of active deals',
    },
    {
        label: 'Tasks due',
        icon: CalendarDays,
        description: 'Upcoming follow-ups',
    },
]

export default function DashboardPage() {
    return (
            
            <div className="space-y-9">
                <section>
                    <p className="text-sm font-medium text-cyan-700">
                        OVERVIEW
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight">
                        Dashboard
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Track your sales activity and manage customer relationships.
                    </p>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.map(({ label, icon: Icon, description }) => (
                        <article
                            key={label}
                            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-600">
                                    {label}
                                </p>

                                <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                                    <Icon size={19} />
                                </div>
                            </div>

                            <p className="mt-5 text-3xl font-bold">—</p>

                            <p className="mt-2 text-sm text-slate-500">
                                {description}
                            </p>
                        </article>
                    ))}
                </section>

                <section className="grid gap-6 xl:grid-cols-2">
                    <article className="rounded-xl border border-slate-200 bg-white p-6">
                        <h2 className="text-lg font-semibold">Sales pipeline</h2>

                        <p className="mt-1 text-sm text-slate-500">
                            An overview of your deals by stage.
                        </p>

                        <div className="mt-6 flex min-h-40 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                            <p className="max-w-sm text-sm text-slate-500">
                                Your sales pipeline will appear here once we connect the
                                deals module and database.
                            </p>
                        </div>
                    </article>

                    <article className="rounded-xl border border-slate-200 bg-white p-6">
                        <h2 className="text-lg font-semibold">Recent activity</h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Follow the latest customer interactions.
                        </p>

                        <div className="mt-6 flex min-h-40 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                            <p className="max-w-sm text-sm text-slate-500">
                                Calls, meetings, and updates will appear here after we
                                implement activity tracking.
                            </p>
                        </div>
                    </article>
                </section>

                <p className="text-xs text-slate-400">
                    UI preview: metrics and activity are not connected to live data yet.
                </p>
            </div>
        

        
        
    )
}

/*<div className="flex-col px-8 py-6 space-y-2">
            <p className='text-lg text-blue-400 font-medium'>OVERVIEW</p>
            <p className='text-3xl text-slate-900 font-bold tracking-tight'>Dashboard</p>
            <p className='text-slate-400'>Track your sales activity and manage customer relationships.</p>

            <div className="flex items-center justify-center gap-6 pt-6  sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map(({ label, icon: Icon, description }) => (
                    <div className="w-90 h-40 rounded-lg bg-white shadow py-3 px-3 ">
                        <div className="flex items-center justify-between ">
                            <p>{label}</p> 
                            <div className="bg-slate-200 rounded-lg p-2 text-slate-600"><Icon size={19}/></div>
                        </div>
                        <p className='text-3xl text-slate-900 font-bold mt-5'>—</p>
                        <p className='mt-2 text-slate-400'>{description}</p>
                    </div>
                ))}
            </div>
            <div className="pt-4 flex items-center justify-center gap-2">
                <div className="w-180 h-auto bg-white p-6 rounded-lg shadow">
                    <h1 >Sales pipline</h1>
                    <p className='text-slate-400 pt-2'>An overview of your deals by stage.</p>
                    <div className="bg-slate-100 w-full h-90 mt-4 rounded-xl items-center justify-center flex p-6">
                        <p className='text-slate-400'>Your sales pipeline will appear here once we connect the deals module and database.</p>
                    </div>                    
                </div>
                <div className="w-180 h-auto bg-white p-6 rounded-lg shadow">
                    <h1 >Recent Activity</h1>
                    <p className='text-slate-400 pt-2'>Follow the latest customer interactions.</p>
                    <div className="bg-slate-100 w-full h-90 mt-4 rounded-xl items-center justify-center flex p-6">
                        <p className='text-slate-400'>Calls, meetings, and updates will appear here after we
                            implement activity tracking.</p>
                    </div>
                </div>
                
            </div>*/