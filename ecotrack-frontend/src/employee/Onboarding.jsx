import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Icon, Logo } from '../components/ui.jsx'
import { BASELINE_MODES, weeklyBaseline } from '../lib/emissions.js'
import { useEmployee } from '../store/EmployeeContext.jsx'

// Screen 1 · Set your starting point (baseline survey)
export default function Onboarding() {
  const { profile, saveBaseline } = useEmployee()
  const nav = useNavigate()
  const b = profile?.baseline
  const [mode, setMode] = useState(b?.mode ?? 'car')
  const [km, setKm] = useState(b?.km ?? 14)
  const [officeDays, setOfficeDays] = useState(b?.officeDays ?? 4)
  const [autoDetect, setAutoDetect] = useState(profile?.autoDetect ?? true)
  const [saving, setSaving] = useState(false)

  const preview = weeklyBaseline({ mode, km, officeDays })

  async function submit() {
    setSaving(true)
    await saveBaseline({ mode, km, officeDays, autoDetect })
    nav('/app/home')
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex items-center justify-between">
        <Logo />
        <span className="text-xs text-ink-400">Step 2 of 3</span>
      </div>
      <div className="mt-3 flex gap-1.5">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full ${s <= 2 ? 'bg-leaf' : 'bg-line'}`} />
        ))}
      </div>

      <h1 className="mt-6 text-2xl font-bold tracking-tight">Set your starting point</h1>
      <p className="mt-1 text-sm text-ink-600">
        Two minutes now. Your progress is measured against your own baseline, so everyone has a fair chance to win.
      </p>

      <p className="mt-6 text-sm font-semibold">How do you usually get to work?</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {BASELINE_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`rounded-xl border px-3 py-3 text-left text-sm transition ${
              mode === m.id ? 'border-leaf bg-leaf-100 font-semibold text-leaf' : 'border-line bg-white hover:border-leaf-400'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <Card className="mt-4 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">Home to office</span>
          <span className="font-semibold">{km} km</span>
        </div>
        <input type="range" min="1" max="60" value={km} onChange={(e) => setKm(+e.target.value)} className="mt-3 w-full" />
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-ink-600">Office days a week</span>
          <div className="flex items-center gap-2">
            <Step onClick={() => setOfficeDays(Math.max(1, officeDays - 1))} label="−" />
            <span className="w-14 text-center font-semibold">{officeDays} days</span>
            <Step onClick={() => setOfficeDays(Math.min(6, officeDays + 1))} label="+" />
          </div>
        </div>
      </Card>

      <Card className="mt-3 flex items-start gap-3 p-4">
        <Icon name="ShieldCheck" className="mt-0.5 shrink-0 text-leaf" />
        <div className="flex-1">
          <p className="text-sm font-semibold">Automatic trip detection</p>
          <p className="text-xs text-ink-600">
            Optional. Only you see your trip details. Your company sees team totals, never individuals.
          </p>
        </div>
        <Toggle on={autoDetect} onChange={setAutoDetect} />
      </Card>

      <p className="mt-4 text-center text-xs text-ink-600">
        Your starting footprint: <b className="text-ink">{preview} kg CO₂e a week</b>
      </p>

      <div className="mt-auto pt-6">
        <Button className="w-full py-3" onClick={submit} disabled={saving}>
          {saving ? 'Saving…' : 'Continue'}
        </Button>
        <p className="mt-3 text-center text-[11px] leading-snug text-ink-400">
          Consent follows India's DPDP Act, 2023. You can pause tracking or delete your data any time.
        </p>
      </div>
    </div>
  )
}

function Step({ onClick, label }) {
  return (
    <button onClick={onClick} className="grid h-7 w-7 place-items-center rounded-lg border border-line bg-white text-sm hover:border-leaf">
      {label}
    </button>
  )
}

function Toggle({ on, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? 'bg-leaf' : 'bg-line'}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  )
}
