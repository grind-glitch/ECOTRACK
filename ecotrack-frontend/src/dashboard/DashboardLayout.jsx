import { NavLink, Outlet } from 'react-router-dom'
import { Icon, Logo } from '../components/ui.jsx'

const NAV = [
  { to: '/dashboard', label: 'Overview', icon: 'LayoutDashboard', end: true },
  { to: '/dashboard/teams', label: 'Teams', icon: 'Users' },
  { to: '/dashboard/locations', label: 'Locations', icon: 'MapPin' },
  { to: '/dashboard/challenges', label: 'Challenges and rewards', icon: 'Gift' },
  { to: '/dashboard/reports', label: 'BRSR reports', icon: 'FileText' },
]

export default function DashboardLayout() {
  return (
    <div className="min-h-full bg-canvas lg:flex">
      {/* Sidebar (desktop) */}
      <aside className="no-print hidden w-60 shrink-0 flex-col bg-forest p-4 text-white lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div className="px-2 py-2"><Logo light /></div>
        <nav className="mt-6 space-y-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-leaf text-white' : 'text-leaf-200 hover:bg-white/5'}`
              }
            >
              <Icon name={n.icon} size={16} />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto rounded-xl bg-white/5 p-3 text-xs text-leaf-200">
          <p className="mb-1 flex items-center gap-1.5 font-semibold text-white"><Icon name="Lock" size={13} /> Privacy by design</p>
          This view shows team and company totals only. Teams with fewer than 5 people are hidden.
        </div>
      </aside>

      {/* Top bar (mobile / tablet) */}
      <header className="no-print sticky top-0 z-10 bg-forest px-4 pt-3 text-white lg:hidden">
        <Logo light />
        <nav className="-mx-4 mt-2 flex gap-1 overflow-x-auto px-4 pb-2">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-1.5 text-xs ${isActive ? 'bg-leaf' : 'text-leaf-200'}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}

// Page header used by every dashboard page
export function PageHeader({ title, subtitle = 'Northwind Technologies · all locations', children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-xs text-ink-400">{subtitle}</p>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      </div>
      <div className="no-print flex flex-wrap gap-2">{children}</div>
    </div>
  )
}
