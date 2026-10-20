import { Button, Card, Icon } from '../components/ui.jsx'
import { MODES } from '../lib/emissions.js'
import { downloadCSV } from '../lib/csv.js'
import { PageHeader } from './DashboardLayout.jsx'
import { useOverview } from './useOverview.js'

// BRSR / ESG report. "Save as PDF" uses the browser's print dialog,
// so no PDF library is needed for the prototype.
export default function Reports() {
  const data = useOverview()
  if (!data) return <p className="text-sm text-ink-400">Loading…</p>

  const total = data.trend.reduce((s, w) => s + w.tco2e, 0)
  const share = (ids) => data.sources.filter((s) => ids.includes(s.id)).reduce((s, x) => s + x.pct, 0) / 100
  const cat6 = +(total * share(['flights'])).toFixed(1)
  const cat7 = +(total * share(['car', 'twoWheeler', 'cab', 'bus', 'metro'])).toFixed(1)
  const office = +(total * share(['office'])).toFixed(1)

  const rows = [
    { category: 'Scope 3 · Category 6 · Business travel', tco2e: cat6, method: 'Distance-based, per passenger-km' },
    { category: 'Scope 3 · Category 7 · Employee commuting', tco2e: cat7, method: 'Distance-based, per passenger-km' },
    { category: 'Office habits (supporting metric)', tco2e: office, method: 'Check-in based estimate' },
  ]

  return (
    <>
      <PageHeader title="BRSR report" subtitle="Northwind Technologies · last 12 weeks">
        <Button variant="ghost" onClick={() => downloadCSV('ecotrack-brsr-scope3.csv', rows)}>
          <Icon name="Download" size={15} /> CSV
        </Button>
        <Button onClick={() => window.print()}><Icon name="FileText" size={15} /> Save as PDF</Button>
      </PageHeader>

      <Card className="mx-auto max-w-3xl p-6 sm:p-8 print:border-0 print:p-0">
        <p className="text-xs uppercase tracking-wider text-ink-400">Business Responsibility and Sustainability Report · Principle 6</p>
        <h2 className="mt-1 text-xl font-bold">Employee-related Scope 3 emissions</h2>
        <p className="mt-1 text-sm text-ink-600">Reporting period: last 12 weeks · Prepared with EcoTrack · Aligned to the GHG Protocol Scope 3 Standard</p>

        <table className="mt-6 w-full text-sm">
          <thead className="text-left text-xs text-ink-400">
            <tr><th className="py-2 font-medium">Category</th><th className="font-medium">t CO₂e</th><th className="font-medium">Method</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.category} className="border-t border-line">
                <td className="py-2.5 pr-3">{r.category}</td><td className="font-semibold">{r.tco2e.toFixed(1)}</td><td className="text-ink-600">{r.method}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-ink">
              <td className="py-2.5 font-semibold">Total</td><td className="font-bold">{total.toFixed(1)}</td><td />
            </tr>
          </tbody>
        </table>

        <h3 className="mt-8 font-semibold">Data coverage</h3>
        <p className="mt-1 text-sm text-ink-600">
          {data.kpis.activeEmployees} of {data.kpis.totalEmployees} employees ({Math.round((data.kpis.activeEmployees / data.kpis.totalEmployees) * 100)}%)
          contributed data. Values for non-participating employees are not extrapolated in this prototype.
        </p>

        <h3 className="mt-6 font-semibold">Emission factors used</h3>
        <table className="mt-2 w-full text-sm">
          <tbody>
            {Object.values(MODES).map((m) => (
              <tr key={m.label} className="border-t border-line">
                <td className="py-1.5">{m.label}</td><td className="text-ink-600">{m.factor} kg CO₂e / passenger-km</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-ink-400">
          Factors are placeholders for the prototype. Replace with India GHG Program road and rail factors and the CEA grid emission factor before external reporting.
        </p>

        <h3 className="mt-6 font-semibold">Privacy</h3>
        <p className="mt-1 text-sm text-ink-600">
          Collected with opt-in consent under the Digital Personal Data Protection Act, 2023. Only aggregated team and company figures are reported.
        </p>
      </Card>
    </>
  )
}
