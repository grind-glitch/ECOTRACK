import { useEffect, useState } from 'react'
import { Avatar, Icon, fmtPct } from '../components/ui.jsx'
import { api } from '../lib/api.js'
import { useEmployee } from '../store/EmployeeContext.jsx'

// Screen 4 · Leaderboard — ranked by % reduction against your own baseline
export default function Leaderboard() {
  const { profile, week } = useEmployee()
  const [tab, setTab] = useState('people')
  const [people, setPeople] = useState([])
  const [teams, setTeams] = useState([])
  const [challenge, setChallenge] = useState(null)

  useEffect(() => {
    api.getLeaderboard('people').then(setPeople)
    api.getLeaderboard('teams').then(setTeams)
    api.getChallenges().then((cs) => setChallenge(cs.find((c) => c.status === 'live')))
  }, [])

  const me = { id: 'me', name: 'You', initials: profile.initials, team: profile.team, change: week.change, me: true }
  const rows = (tab === 'people' ? [...people, me] : teams).slice().sort((a, b) => a.change - b.change)
  const teamRank = teams.slice().sort((a, b) => a.change - b.change).findIndex((t) => t.name === profile.team) + 1

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-bold">Leaderboard</h1>
        <p className="text-xs text-ink-600">Ranked by % reduction against your own baseline, so distance never decides the winner.</p>
      </header>

      <div className="grid grid-cols-2 rounded-xl bg-canvas p-1">
        {['people', 'teams'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg py-2 text-sm font-semibold capitalize ${tab === t ? 'bg-white shadow-sm' : 'text-ink-600'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {challenge && teamRank > 0 && (
        <div className="flex items-center justify-between rounded-2xl bg-forest p-4 text-white">
          <div>
            <p className="text-[11px] text-leaf-200">{challenge.name} challenge</p>
            <p className="font-bold">Team {profile.team} is #{teamRank} of {teams.length}</p>
            <p className="text-[11px] text-leaf-200">{challenge.daysLeft} days left · prize: {challenge.reward.toLowerCase()}</p>
          </div>
          <Icon name="Trophy" size={26} className="text-sun" />
        </div>
      )}

      <ol className="space-y-2">
        {rows.map((r, i) => (
          <li
            key={r.id}
            className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${r.me ? 'border-leaf bg-leaf-100' : 'border-line bg-white'}`}
          >
            <span className="w-5 text-center text-sm font-semibold text-ink-600">{i + 1}</span>
            <Avatar initials={r.initials ?? r.name.slice(0, 2).toUpperCase()} active={r.me} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{r.name}</p>
              <p className="text-[11px] text-ink-400">{tab === 'people' ? r.team : `${r.people} people`}</p>
            </div>
            <span className={`text-sm font-bold ${r.change <= 0 ? 'text-leaf' : 'text-[#b4541a]'}`}>{fmtPct(r.change)}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
