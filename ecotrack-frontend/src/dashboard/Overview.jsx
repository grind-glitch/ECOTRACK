import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar as RBar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Bar, Button, Card, Icon, fmtPct } from '../components/ui.jsx'
import { downloadCSV } from '../lib/csv.js'
import { PageHeader } from './DashboardLayout.jsx'
import { useOverview } from './useOverview.js'
import ChallengeCard from './ChallengeCard.jsx'

export default function Overview() {
  const data = useOverview()
  const nav = useNavigate()
  const [weeks, setWeeks] = useState(12)
  if (!data) return <p className="text-sm text-ink-400">Loading…</p>

  const { kpis, trend, sources, teams, locations } = data
  const shown = trend.slice(-weeks)
  const ranked = teams.slice().sort((a, b) => a.change - b.change)
  const maxDrop = Math.max(...ranked.map((t) => Math.abs(t.change)))

  return (
    <>
      <PageHeader title="Employee emissions">
        <select
          value={weeks}
          onChange={(e) => setWeeks(+e.target.value)}
          className="rounded-xl border border-line bg-white px-3 py-2 text-sm"
        >
          <option value={4}>Last 4 weeks</option>
          <option value={12}>Last 12 weeks</option>
        </select>
        <Button variant="ghost" onClick={() => downloadCSV('ecotrack-teams.csv', teams.map(({ id, ...t }) => t))}>
          <Icon name="Download" size={15} /> Export CSV
        </Button>
        <Button onClick={() => nav('/dashboard/reports')}>Export BRSR report (PDF)</Button>
      </PageHeader>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi label="Total employee emissions" value={kpis.totalTco2e} unit="t CO₂e" note={kpis.scope} />
        <Kpi label="Change vs baseline" value={fmtPct(kpis.changeVsBaseline)} accent note="Weekly average vs first 2 weeks" />
        <Kpi label="Active employees" value={kpis.activeEmployees} unit={`of ${kpis.totalEmployees}`}>
          <div className="mt-2"><Bar pct={(kpis.activeEmployees / kpis.totalEmployees) * 100} className="bg-leaf" /></div>
        </Kpi>
        <Kpi label="Per active employee" value={kpis.perActiveKg} unit="kg" note={`Over ${weeks} weeks`} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="flex flex-col p-5 xl:col-span-2">
          <div className="flex justify-between">
            <h2 className="font-semibold">Weekly emissions trend</h2>
            <span className="text-xs text-ink-400">t CO₂e per week</span>
          </div>
          <div className="mt-4 h-56 flex-1 xl:h-auto xl:min-h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shown} margin={{ left: -20 }}>
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#8a978f' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#8a978f' }} />
                <Tooltip cursor={{ fill: '#f3f8f4' }} formatter={(v) => [`${v} t CO₂e`, 'Emissions']} />
                <RBar dataKey="tco2e" radius={[4, 4, 0, 0]}>
                  {shown.map((_, i) => <Cell key={i} fill={i === shown.length - 1 ? '#2f7d4f' : '#a9d3b6'} />)}
                </RBar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold">Where emissions come from</h2>
          <ul className="mt-4 space-y-3">
            {sources.map((s) => (
              <li key={s.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{s.label}</span><span className="text-ink-600">{s.pct}%</span>
                </div>
                <Bar pct={(s.pct / sources[0].pct) * 100} />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="overflow-x-auto p-5 xl:col-span-2">
          <div className="flex justify-between">
            <h2 className="font-semibold">Team improvement leaderboard</h2>
            <span className="text-xs text-ink-400">% reduction vs team baseline</span>
          </div>
          <table className="mt-3 w-full min-w-[460px] text-sm">
            <thead className="text-left text-xs text-ink-400">
              <tr><th className="py-2 font-medium">Rank</th><th className="font-medium">Team</th><th className="font-medium">People</th><th className="font-medium">t CO₂e</th><th className="font-medium">Change</th></tr>
            </thead>
            <tbody>
              {ranked.map((t, i) => (
                <tr key={t.id} className="border-t border-line">
                  <td className="py-2.5">{i + 1}</td>
                  <td className="font-medium">{t.name}</td>
                  <td>{t.people}</td>
                  <td>{t.tco2e}</td>
                  <td className="w-40">
                    <div className="flex items-center gap-2">
                      <Bar pct={(Math.abs(t.change) / maxDrop) * 100} className="bg-leaf" />
                      <span className="w-10 text-right text-xs font-semibold text-leaf">{fmtPct(t.change)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div className="space-y-4">
          <ChallengeCard />
          <Card className="p-5">
            <h2 className="font-semibold">By location</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {locations.map((l) => (
                <li key={l.id} className="flex justify-between"><span>{l.name}</span><span className="font-semibold">{l.tco2e.toFixed(1)} t</span></li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-leaf-100 p-5">
        <div className="max-w-2xl">
          <p className="font-semibold">Ready for ESG disclosure</p>
          <p className="text-sm text-ink-600">
            Employee commuting (Scope 3, category 7) and business travel (category 6), aligned to the GHG Protocol and the BRSR format, built from the same data.
          </p>
        </div>
        <Button onClick={() => nav('/dashboard/reports')}>Generate quarterly report</Button>
      </div>
      <p className="mt-3 text-xs text-ink-400">Sample data for design preview.</p>
    </>
  )
}

function Kpi({ label, value, unit, note, accent, children }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-ink-600">{label}</p>
      <p className={`mt-1 text-2xl font-bold tracking-tight ${accent ? 'text-leaf' : ''}`}>
        {value} {unit && <span className="text-sm font-medium text-ink-600">{unit}</span>}
      </p>
      {note && <p className="mt-1 text-[11px] text-ink-400">{note}</p>}
      {children}
    </Card>
  )
}
