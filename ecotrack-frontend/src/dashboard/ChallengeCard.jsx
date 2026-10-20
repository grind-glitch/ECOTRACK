import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button } from '../components/ui.jsx'
import { api } from '../lib/api.js'

// Dark "live challenge" card from the dashboard design
export default function ChallengeCard() {
  const [c, setC] = useState(null)
  const nav = useNavigate()
  useEffect(() => { api.getChallenges().then((cs) => setC(cs.find((x) => x.status === 'live'))) }, [])
  if (!c) return null
  const pct = Math.round((c.participants / c.eligible) * 100)

  return (
    <div className="rounded-2xl bg-forest p-5 text-white">
      <div className="flex items-center justify-between">
        <p className="font-semibold">{c.name}</p>
        <Badge tone="dark">Live</Badge>
      </div>
      <p className="mt-2 text-sm text-leaf-200">{c.description}</p>
      <div className="mt-4 flex justify-between text-xs text-leaf-200">
        <span>Participation</span><span>{c.participants} of {c.eligible}</span>
      </div>
      <div className="mt-1.5 h-1.5 rounded-full bg-white/10">
        <div className="h-1.5 rounded-full bg-sun" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="sun" className="px-3 py-2 text-xs" onClick={() => nav('/dashboard/challenges')}>Assign reward</Button>
        <Button variant="dark" className="border border-white/20 px-3 py-2 text-xs" onClick={() => nav('/dashboard/challenges', { state: { create: true } })}>
          New challenge
        </Button>
      </div>
    </div>
  )
}
