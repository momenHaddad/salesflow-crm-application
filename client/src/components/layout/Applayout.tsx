import { Activity, BriefcaseBusiness, CalendarDays, Building2, LayoutDashboard, TrendingUp, Users, LogOut } from "lucide-react";
import {NavLink, Outlet} from "react-router";

import { useNavigate } from 'react-router'
import { useState } from 'react'
import { authClient } from '../../lib/auth-client'

const navigation = [
    {label: 'Dashboard', to: '/', icon: LayoutDashboard, end: true},
    {label: 'Companies', to: '/companies', icon: Building2},
    {label: 'Contacts', to: '/contacts', icon: Users},
    {label: 'Leads', to: '/leads', icon: TrendingUp},
    {label: 'Deals', to: '/deals', icon: BriefcaseBusiness},
    {label: 'Tasks', to: '/tasks', icon: CalendarDays},
]

export function Applayout() {
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()
  const [signOutError, setSignOutError] = useState('')

  const displayName =
    session?.user.name?.trim() ||
    session?.user.email ||
    'Signed-in user'

  const initials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  async function handleSignOut() {
    setSignOutError('')

    try {
      const { error } = await authClient.signOut()

      if (error) {
        setSignOutError(error.message || 'Unable to sign out. Please try again.')
        return
      }

      navigate('/login', { replace: true })
    } catch {
      setSignOutError('Unable to sign out. Please try again.')
    }
  }
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
          <div className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Activity size={20} />
          </div>

          <div>
            <p className="font-bold tracking-tight">SalesFlow</p>
            <p className="text-xs text-slate-500">CRM WORKSPACE</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          {navigation.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={label}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                ].join(' ')
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>


          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center gap-3 rounded-lg p-2">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-900">
                {initials}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {displayName}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {session?.user.email}
                </p>
              </div>
            </div>

            {signOutError && (
              <p role="alert" className="px-2 py-1 text-xs text-red-600">
                {signOutError}
              </p>
            )}

            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              <LogOut size={17} />
              Sign out
            </button>
          </div>

      </aside>

      <div className="min-h-screen md:pl-64">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
          <div>
            <p className="text-sm font-semibold">Acme Studio</p>
            <p className="text-xs text-slate-500">Demo workspace</p>
          </div>

          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            Development preview
          </span>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white p-2 md:hidden">
          {navigation.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={label}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm',
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100',
                ].join(' ')
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
    )
}