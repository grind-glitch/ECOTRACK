import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { Icon } from '../components/ui.jsx'
import { useEmployee } from '../store/EmployeeContext.jsx'

// Phone-width shell. Full screen on a phone, a centred phone frame on desktop.
// When this becomes React Native, each screen file maps 1:1 to a native screen.
export default function EmployeeLayout() {
  const { loading, profile } = useEmployee()
  const { pathname } = useLocation()
  const onboarding = pathname.endsWith('/onboarding')

  if (loading) return <div className="grid h-full place-items-center text-sm text-ink-400">Loading…</div>
  if (!profile?.baseline && !onboarding) return <Navigate to="/app/onboarding" replace />

  return (
    <div className="flex min-h-full justify-center bg-canvas sm:py-8">
      <div className="relative flex min-h-full w-full max-w-[420px] flex-col bg-[#fafbfa] sm:min-h-[820px] sm:rounded-[28px] sm:border sm:border-line sm:shadow-xl sm:shadow-forest/5">
        <main className={`flex-1 overflow-y-auto px-5 pt-6 ${onboarding ? 'pb-6' : 'pb-24'}`}>
          <Outlet />
        </main>
        {!onboarding && <TabBar />}
      </div>
    </div>
  )
}

function TabBar() {
  const tabs = [
    { to: '/app/home', label: 'Home', icon: 'House' },
    { to: '/app/log', label: 'Log trip', icon: 'CirclePlus' },
    { to: '/app/ranks', label: 'Ranks', icon: 'ChartNoAxesColumn' },
  ]
  return (
    <nav className="fixed bottom-0 left-1/2 z-10 flex w-full max-w-[420px] -translate-x-1/2 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] sm:absolute sm:rounded-b-[28px]">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-medium ${isActive ? 'text-leaf' : 'text-ink-400'}`
          }
        >
          <Icon name={t.icon} size={20} />
          {t.label}
        </NavLink>
      ))}
    </nav>
  )
}
