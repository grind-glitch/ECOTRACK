import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Badge, Button, Card, Icon } from '../components/ui.jsx'
import { api } from '../lib/api.js'
import { PageHeader } from './DashboardLayout.jsx'

const REWARDS = ['Extra leave day', '₹500 voucher', 'Tree planted in their name', 'Team lunch']

export default function Challenges() {
  const [list, setList] = useState([])
  const [showForm, setShowForm] = useState(!!useLocation().state?.create)
  const load = () => api.getChallenges().then(setList)
  useEffect(() => { load() }, [])

  async function award(c) {
    await api.updateChallenge(c.id, { status: 'rewarded' })
    load()
  }

  return (
    <>
      <PageHeader title="Challenges and rewards">
        <Button onClick={() => setShowForm((v) => !v)}><Icon name="Plus" size={15} /> New challenge</Button>
      </PageHeader>

      {showForm && <NewChallenge onDone={() => { setShowForm(false); load() }} />}

      <div className="grid gap-4 md:grid-cols-2">
        {list.map((c) => {
          const pct = Math.round((c.participants / c.eligible) * 100)
          return (
            <Card key={c.id} className="p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{c.name}</h2>
                <Badge tone={c.status === 'live' ? 'leaf' : 'sun'}>
                  {c.status === 'live' ? 'Live' : c.status === 'rewarded' ? 'Rewarded' : 'Ended'}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-ink-600">{c.description}</p>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div><dt className="text-ink-400">Reward</dt><dd className="mt-0.5 font-semibold">{c.reward}</dd></div>
                <div><dt className="text-ink-400">Leading team</dt><dd className="mt-0.5 font-semibold">{c.leaderTeam}</dd></div>
                <div><dt className="text-ink-400">{c.status === 'live' ? 'Days left' : 'Participation'}</dt>
                  <dd className="mt-0.5 font-semibold">{c.status === 'live' ? c.daysLeft : `${pct}%`}</dd></div>
              </dl>
              <div className="mt-4 h-1.5 rounded-full bg-canvas"><div className="h-1.5 rounded-full bg-leaf" style={{ width: `${pct}%` }} /></div>
              <p className="mt-1 text-[11px] text-ink-400">{c.participants} of {c.eligible} employees taking part</p>
              {c.status !== 'rewarded' && (
                <Button variant={c.status === 'live' ? 'ghost' : 'sun'} className="mt-4 text-xs" onClick={() => award(c)}>
                  <Icon name="Trophy" size={14} /> Assign reward to {c.leaderTeam}
                </Button>
              )}
            </Card>
          )
        })}
      </div>
    </>
  )
}

function NewChallenge({ onDone }) {
  const [f, setF] = useState({ name: '', description: '', reward: REWARDS[0], daysLeft: 30 })
  const set = (k) => (e) => setF({ ...f, [k]: k === 'daysLeft' ? +e.target.value : e.target.value })
  const input = 'mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-leaf'

  async function submit(e) {
    e.preventDefault()
    if (!f.name.trim()) return
    await api.createChallenge(f)
    onDone()
  }

  return (
    <Card className="mb-4 p-5">
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
        <label className="text-xs text-ink-600">Name
          <input className={input} value={f.name} onChange={set('name')} placeholder="e.g. Cycle Week" required />
        </label>
        <label className="text-xs text-ink-600">Reward
          <select className={input} value={f.reward} onChange={set('reward')}>{REWARDS.map((r) => <option key={r}>{r}</option>)}</select>
        </label>
        <label className="text-xs text-ink-600 md:col-span-2">What counts
          <input className={input} value={f.description} onChange={set('description')} placeholder="e.g. Cycle or walk to work at least twice a week" />
        </label>
        <label className="text-xs text-ink-600">Duration (days)
          <input type="number" min="1" max="90" className={input} value={f.daysLeft} onChange={set('daysLeft')} />
        </label>
        <div className="flex items-end gap-2">
          <Button type="submit">Launch challenge</Button>
          <Button type="button" variant="ghost" onClick={onDone}>Cancel</Button>
        </div>
      </form>
    </Card>
  )
}
