import { Card, Icon, fmtPct } from '../components/ui.jsx'
import { PageHeader } from './DashboardLayout.jsx'
import { useOverview } from './useOverview.js'

export default function Locations() {
  const data = useOverview()
  if (!data) return <p className="text-sm text-ink-400">Loading…</p>

  return (
    <>
      <PageHeader title="Locations" />
      <div className="grid gap-4 md:grid-cols-3">
        {data.locations.map((l) => (
          <Card key={l.id} className="p-5">
            <div className="flex items-center gap-2 text-ink-600">
              <Icon name="MapPin" size={16} className="text-leaf" />
              <span className="text-sm font-semibold text-ink">{l.name}</span>
            </div>
            <p className="mt-4 text-3xl font-bold">{l.tco2e} <span className="text-sm font-medium text-ink-600">t CO₂e</span></p>
            <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 text-xs">
              <div><dt className="text-ink-400">Employees</dt><dd className="mt-0.5 text-sm font-semibold">{l.employees}</dd></div>
              <div><dt className="text-ink-400">Per person</dt><dd className="mt-0.5 text-sm font-semibold">{Math.round((l.tco2e * 1000) / l.employees)} kg</dd></div>
              <div><dt className="text-ink-400">Change</dt><dd className="mt-0.5 text-sm font-semibold text-leaf">{fmtPct(l.change)}</dd></div>
            </dl>
          </Card>
        ))}
      </div>
      <p className="mt-4 text-xs text-ink-400">Figures cover the last 12 weeks. Office locations are set by the admin during onboarding.</p>
    </>
  )
}
