import { useNavigate } from 'react-router-dom'
import { Avatar, Button, Card, Icon } from '../components/ui.jsx'
import { MODES, biggestSourceTip, tripEmissions } from '../lib/emissions.js'
import { useEmployee } from '../store/EmployeeContext.jsx'

// Screen 2 · Home
export default function Home() {
  const { profile, week, stats, pendingTrip, confirmTrip, trips } = useEmployee()
  const nav = useNavigate()
  const tip = biggestSourceTip(trips)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const max = Math.max(1, ...week.days.map((d) => d.kg))

  return (
    <div className="space-y-3">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-xs text-ink-600">{greeting}</p>
          <h1 className="text-xl font-bold">{profile.name.split(' ')[0]}</h1>
        </div>
        <button onClick={() => nav('/app/onboarding')} title="Edit baseline">
          <Avatar initials={profile.initials} />
        </button>
      </header>

      {/* This week */}
      <div className="rounded-2xl bg-forest p-5 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-leaf-200">Last 7 days</p>
            <p className="mt-1 text-4xl font-bold tracking-tight">
              {week.total} <span className="text-base font-medium text-leaf-200">kg CO₂e</span>
            </p>
          </div>
          <span className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${week.change <= 0 ? 'bg-leaf-400 text-forest' : 'bg-sun text-forest'}`}>
            {Math.abs(week.change)}% {week.change <= 0 ? 'below' : 'above'} your baseline
          </span>
        </div>
        <div className="mt-5 flex h-24 items-end gap-2">
          {week.days.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={`w-full rounded-md ${d.isToday ? 'bg-sun' : d.kg ? 'bg-leaf-500' : 'bg-white/10'}`}
                style={{ height: Math.max(6, (d.kg / max) * 80) }}
                title={`${d.kg} kg`}
              />
              <span className="text-[10px] text-leaf-200">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <p className="text-xs text-ink-600">Low-carbon streak</p>
          <p className="mt-1 text-xl font-bold">{stats?.streakDays ?? 0} days</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-ink-600">Saved this month</p>
          <p className="mt-1 text-xl font-bold">{stats?.savedThisMonthKg ?? 0} kg</p>
        </Card>
      </div>

      {/* Auto-detected trip waiting for a one-tap confirm */}
      {pendingTrip && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-leaf-100 px-2.5 py-1 text-[11px] font-semibold text-leaf">Trip detected</span>
            <span className="text-xs text-ink-400">
              {new Date(pendingTrip.date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </span>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold">{pendingTrip.label}</p>
              <p className="text-xs text-ink-600">{MODES[pendingTrip.mode].label} · {pendingTrip.km} km</p>
            </div>
            <p className="text-lg font-bold">{tripEmissions(pendingTrip.mode, pendingTrip.km).toFixed(1)} <span className="text-xs font-medium text-ink-600">kg</span></p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button onClick={() => confirmTrip(pendingTrip.id)}>Looks right</Button>
            <Button variant="outline" onClick={() => nav('/app/log', { state: { editId: pendingTrip.id } })}>Edit</Button>
          </div>
        </Card>
      )}

      {tip && (
        <div className="flex gap-3 rounded-2xl bg-sun-100 p-4 text-sm text-[#5c4410]">
          <Icon name="Lightbulb" className="mt-0.5 shrink-0" />
          <p>{tip.text}</p>
        </div>
      )}
    </div>
  )
}
