import { Bar, Button, Card, Icon, fmtPct } from '../components/ui.jsx'
import { downloadCSV } from '../lib/csv.js'
import { PageHeader } from './DashboardLayout.jsx'
import { useOverview } from './useOverview.js'

export default function Teams() {
  const data = useOverview()
  if (!data) return <p className="text-sm text-ink-400">Loading…</p>
  const rows = data.teams
    .map((t) => ({ ...t, perPerson: Math.round((t.tco2e * 1000) / t.people) }))
    .sort((a, b) => a.change - b.change)
  const maxPer = Math.max(...rows.map((r) => r.perPerson))

  return (
    <>
      <PageHeader title="Teams">
        <Button variant="ghost" onClick={() => downloadCSV('ecotrack-teams.csv', rows.map(({ id, ...r }) => r))}>
          <Icon name="Download" size={15} /> Export CSV
        </Button>
      </PageHeader>
      <Card className="overflow-x-auto p-5">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="text-left text-xs text-ink-400">
            <tr>
              <th className="py-2 font-medium">Team</th><th className="font-medium">People</th><th className="font-medium">t CO₂e (12 wk)</th>
              <th className="font-medium">kg per person</th><th className="font-medium">Change vs baseline</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-t border-line">
                <td className="py-3 font-medium">{t.name}</td>
                <td>{t.people}</td>
                <td>{t.tco2e}</td>
                <td className="w-48">
                  <div className="flex items-center gap-2">
                    <Bar pct={(t.perPerson / maxPer) * 100} />
                    <span className="w-10 text-right">{t.perPerson}</span>
                  </div>
                </td>
                <td className="font-semibold text-leaf">{fmtPct(t.change)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-400">
          <Icon name="Lock" size={12} /> Teams with fewer than 5 people are hidden to protect individual privacy.
        </p>
      </Card>
    </>
  )
}
