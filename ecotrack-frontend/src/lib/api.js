// ─────────────────────────────────────────────────────────────
// Single data layer for both front ends.
//
// • VITE_API_URL empty  → mock mode: data lives in localStorage (works offline).
// • VITE_API_URL set    → every call goes to your backend instead.
//
// The screens only ever import from this file, so when the backend is
// ready you change nothing in the UI: just implement the same endpoints.
// Endpoint list is in README.md.
// ─────────────────────────────────────────────────────────────
import * as mock from '../data/mock.js'
import { weeklyBaseline } from './emissions.js'

const API = import.meta.env.VITE_API_URL
const KEY = 'ecotrack-demo-v1'

async function http(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status}`)
  return res.status === 204 ? null : res.json()
}

// ---- mock store -------------------------------------------------
function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return {
    profile: mock.seedProfile,
    trips: mock.seedTrips,
    checkins: [],
    challenges: mock.seedChallenges,
  }
}
let db = load()
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(db)) } catch {}
}
const wait = (v) => new Promise((r) => setTimeout(() => r(structuredClone(v)), 120))
const uid = () => Math.random().toString(36).slice(2, 9)

// ---- Employee ---------------------------------------------------
export const api = {
  getProfile: () => (API ? http('GET', '/me') : wait(db.profile)),

  saveBaseline: ({ mode, km, officeDays, autoDetect }) => {
    if (API) return http('PUT', '/me/baseline', { mode, km, officeDays, autoDetect })
    db.profile = {
      ...db.profile,
      autoDetect,
      baseline: { mode, km, officeDays, weeklyKg: weeklyBaseline({ mode, km, officeDays }) },
    }
    save()
    return wait(db.profile)
  },

  getTrips: () => (API ? http('GET', '/me/trips') : wait(db.trips)),

  addTrip: (trip) => {
    if (API) return http('POST', '/me/trips', trip)
    const t = { id: uid(), confirmed: true, ...trip }
    db.trips.push(t)
    save()
    return wait(t)
  },

  updateTrip: (id, patch) => {
    if (API) return http('PATCH', `/me/trips/${id}`, patch)
    db.trips = db.trips.map((t) => (t.id === id ? { ...t, ...patch } : t))
    save()
    return wait(db.trips.find((t) => t.id === id))
  },

  getCheckins: () => (API ? http('GET', '/me/checkins') : wait(db.checkins)),

  addCheckins: (date, habits) => {
    if (API) return http('POST', '/me/checkins', { date, habits })
    habits.forEach((habit) => db.checkins.push({ id: uid(), date, habit }))
    save()
    return wait(db.checkins)
  },

  getMyStats: () => (API ? http('GET', '/me/stats') : wait(mock.seedStats)),

  getLeaderboard: (kind = 'people') => {
    if (API) return http('GET', `/leaderboard?kind=${kind}`)
    return wait(kind === 'teams' ? mock.teams.filter((t) => t.people >= 5) : mock.peopleBoard)
  },

  // ---- Company dashboard (aggregates only: never individual trips) ----
  getOverview: () => {
    if (API) return http('GET', '/company/overview')
    return wait({
      kpis: mock.companyKpis,
      trend: mock.weeklyTrend,
      sources: mock.sources,
      // privacy rule (enforce on the server too): hide teams under 5 people
      teams: mock.teams.filter((t) => t.people >= 5),
      locations: mock.locations,
    })
  },

  getChallenges: () => (API ? http('GET', '/company/challenges') : wait(db.challenges)),

  createChallenge: (c) => {
    if (API) return http('POST', '/company/challenges', c)
    const ch = { id: uid(), status: 'live', participants: 0, eligible: mock.companyKpis.activeEmployees, leaderTeam: '—', ...c }
    db.challenges.unshift(ch)
    save()
    return wait(ch)
  },

  updateChallenge: (id, patch) => {
    if (API) return http('PATCH', `/company/challenges/${id}`, patch)
    db.challenges = db.challenges.map((c) => (c.id === id ? { ...c, ...patch } : c))
    save()
    return wait(db.challenges.find((c) => c.id === id))
  },

  resetDemo: () => {
    localStorage.removeItem(KEY)
    db = load()
    return wait(true)
  },
}

export const isMockMode = !API
