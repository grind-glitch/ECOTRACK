import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api.js'
import { totalFor, changeVsBaseline } from '../lib/emissions.js'

const Ctx = createContext(null)

// Midnight, `offset` days from today (0 = today, -6 = six days ago)
function startOfDay(offset = 0) {
  const x = new Date()
  x.setHours(0, 0, 0, 0)
  x.setDate(x.getDate() + offset)
  return x
}

export function EmployeeProvider({ children }) {
  const [profile, setProfile] = useState(null)
  const [trips, setTrips] = useState([])
  const [checkins, setCheckins] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const [p, t, c, s] = await Promise.all([api.getProfile(), api.getTrips(), api.getCheckins(), api.getMyStats()])
    setProfile(p); setTrips(t); setCheckins(c); setStats(s); setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  // Last 7 days (rolling), derived from confirmed trips + check-ins,
  // compared with the weekly baseline from onboarding.
  const week = useMemo(() => {
    const from = startOfDay(-6)
    const inRange = (x) => new Date(x.date) >= from
    const wTrips = trips.filter((t) => inRange(t) && t.confirmed)
    const wChecks = checkins.filter(inRange)
    const total = totalFor(wTrips, wChecks)
    const days = Array.from({ length: 7 }, (_, i) => {
      const d0 = startOfDay(i - 6)
      const d1 = startOfDay(i - 5)
      const within = (x) => new Date(x.date) >= d0 && new Date(x.date) < d1
      return {
        label: d0.toLocaleDateString('en-IN', { weekday: 'narrow' }),
        kg: totalFor(wTrips.filter(within), wChecks.filter(within)),
        isToday: i === 6,
      }
    })
    const baseline = profile?.baseline?.weeklyKg ?? 0
    return { total, days, baseline, trips: wTrips, change: changeVsBaseline(total, baseline) }
  }, [trips, checkins, profile])

  const pendingTrip = trips.find((t) => !t.confirmed)

  const value = {
    loading, profile, trips, checkins, stats, week, pendingTrip, refresh,
    saveBaseline: async (b) => setProfile(await api.saveBaseline(b)),
    addTrip: async (t) => { await api.addTrip(t); await refresh() },
    confirmTrip: async (id, patch = {}) => { await api.updateTrip(id, { ...patch, confirmed: true }); await refresh() },
    addCheckins: async (date, habits) => { await api.addCheckins(date, habits); await refresh() },
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useEmployee = () => useContext(Ctx)
