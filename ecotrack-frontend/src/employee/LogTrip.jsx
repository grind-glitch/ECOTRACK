import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Card, Chip, Icon } from '../components/ui.jsx'
import { HABITS, MODES, savedVsCar, tripEmissions } from '../lib/emissions.js'
import { useEmployee } from '../store/EmployeeContext.jsx'

// Screen 3 · Log a trip (two-tap manual log + optional office check-in)
export default function LogTrip() {
  const { profile, trips, addTrip, confirmTrip, addCheckins } = useEmployee()
  const nav = useNavigate()
  const editing = trips.find((t) => t.id === useLocation().state?.editId)

  const [mode, setMode] = useState(editing?.mode ?? 'metro')
  const [km, setKm] = useState(editing?.km ?? profile.baseline?.km ?? 10)
  const [when, setWhen] = useState('today')
  const [picked, setPicked] = useState(new Date().toISOString().slice(0, 10))
  const [habits, setHabits] = useState([])
  const [saving, setSaving] = useState(false)

  const kg = tripEmissions(mode, km)
  const saved = savedVsCar(mode, km)

  function dateISO() {
    const d = new Date()
    if (when === 'yesterday') d.setDate(d.getDate() - 1)
    if (when === 'pick') return new Date(`${picked}T12:00:00`).toISOString()
    return d.toISOString()
  }

  async function save() {
    if (!km || km <= 0) return
    setSaving(true)
    const date = dateISO()
    if (editing) await confirmTrip(editing.id, { mode, km: Number(km) })
    else await addTrip({ date, mode, km: Number(km), label: 'Trip' })
    if (habits.length) await addCheckins(date, habits)
    nav('/app/home')
  }

  const toggleHabit = (h) => setHabits((xs) => (xs.includes(h) ? xs.filter((x) => x !== h) : [...xs, h]))

  return (
    <div className="space-y-4">
      <header className="flex items-center gap-2">
        <button onClick={() => nav(-1)} className="-ml-1 p-1" aria-label="Back">
          <Icon name="ChevronLeft" size={22} />
        </button>
        <h1 className="text-xl font-bold">{editing ? 'Edit trip' : 'Log a trip'}</h1>
      </header>

      <div>
        <p className="text-sm font-semibold">How did you travel?</p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {Object.entries(MODES).map(([id, m]) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-[11px] transition ${
                mode === id ? 'border-leaf bg-leaf-100 font-semibold text-leaf' : 'border-line bg-white text-ink-600 hover:border-leaf-400'
              }`}
            >
              <Icon name={m.icon} size={20} />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <label htmlFor="km" className="text-xs text-ink-600">Distance</label>
            <div className="flex items-baseline gap-1">
              <input
                id="km"
                type="number"
                min="0"
                step="0.1"
                value={km}
                onChange={(e) => setKm(e.target.value)}
                style={{ width: `${Math.max(2, String(km).length) + 0.5}ch` }}
                className="bg-transparent text-3xl font-bold outline-none"
              />
              <span className="text-sm text-ink-600">km</span>
            </div>
          </div>
          {profile.baseline && (
            <Chip onClick={() => setKm(profile.baseline.km)}>Use home to office</Chip>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[['today', 'Today'], ['yesterday', 'Yesterday'], ['pick', 'Pick date']].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setWhen(id)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold ${when === id ? 'bg-forest text-white' : 'border border-line bg-white'}`}
            >
              {label}
            </button>
          ))}
          {when === 'pick' && (
            <input type="date" value={picked} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setPicked(e.target.value)}
              className="rounded-lg border border-line px-2 text-xs" />
          )}
        </div>
      </Card>

      <div className="flex items-center justify-between rounded-2xl bg-forest p-4 text-white">
        <div>
          <p className="text-xs text-leaf-200">This trip adds</p>
          <p className="text-2xl font-bold">{kg.toFixed(1)} <span className="text-sm font-medium text-leaf-200">kg CO₂e</span></p>
        </div>
        {saved > 0 && (
          <span className="rounded-full bg-leaf-400 px-3 py-1.5 text-[11px] font-semibold text-forest">
            {saved.toFixed(1)} kg less than by car
          </span>
        )}
      </div>

      <div>
        <p className="text-sm font-semibold">Office check-in <span className="font-normal text-ink-400">· optional</span></p>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(HABITS).map(([id, h]) => (
            <Chip key={id} active={habits.includes(id)} onClick={() => toggleHabit(id)}>
              {habits.includes(id) && '✓ '}{h.label}
            </Chip>
          ))}
        </div>
      </div>

      <Button className="w-full py-3" onClick={save} disabled={saving || !(km > 0)}>
        {saving ? 'Saving…' : 'Save trip'}
      </Button>
    </div>
  )
}
