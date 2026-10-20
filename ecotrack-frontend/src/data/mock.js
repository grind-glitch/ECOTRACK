// Sample data so every screen works before the backend exists.
// The company is fictional ("Northwind Technologies"), matching the design preview.

export const seedProfile = {
  id: 'emp-001',
  name: 'Priya N.',
  initials: 'PN',
  team: 'Platform',
  location: 'Chennai campus',
  company: 'Northwind Technologies',
  baseline: null, // set by onboarding: { mode, km, officeDays, weeklyKg }
  autoDetect: true,
}

// Trips for the last 7 days, generated relative to today so the demo
// always has data. Weekends are skipped.
const at = (daysAgo, hour) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(hour, 0, 0, 0)
  return d
}

function buildSeedTrips() {
  const trips = []
  let officeDay = 0
  for (let ago = 6; ago >= 1; ago--) {
    const d = at(ago, 9)
    if (d.getDay() === 0 || d.getDay() === 6) continue
    officeDay++
    const mode = officeDay === 2 ? 'metro' : 'car' // mostly car, one metro day
    const km = mode === 'metro' ? 14.2 : 14
    trips.push({ id: `s${ago}a`, date: at(ago, 9).toISOString(), mode, km, label: 'Home to office', confirmed: true })
    trips.push({ id: `s${ago}b`, date: at(ago, 18).toISOString(), mode, km, label: 'Office to home', confirmed: true })
  }
  // Today: an auto-detected trip waiting for one-tap confirmation
  const now = new Date()
  const detected = new Date(now.getTime() - 60 * 60 * 1000)
  trips.push({ id: 'auto1', date: detected.toISOString(), mode: 'metro', km: 14.2, label: 'Home to office', confirmed: false, auto: true })
  return trips
}

export const seedTrips = buildSeedTrips()

export const seedStats = { streakDays: 6, savedThisMonthKg: 21 }

// Leaderboard: % change vs each person's own baseline (negative = better)
export const peopleBoard = [
  { id: 'p1', name: 'Ananya R.', initials: 'AR', team: 'Design', change: -31 },
  { id: 'p2', name: 'Karthik M.', initials: 'KM', team: 'Platform', change: -27 },
  { id: 'p3', name: 'Divya S.', initials: 'DS', team: 'Finance', change: -24 },
  { id: 'p4', name: 'Mohan K.', initials: 'MK', team: 'Sales', change: -19 },
  { id: 'p6', name: 'Sana F.', initials: 'SF', team: 'HR', change: -12 },
  { id: 'p7', name: 'Vikram J.', initials: 'VJ', team: 'Operations', change: -9 },
  { id: 'p8', name: 'Meera T.', initials: 'MT', team: 'Design', change: -6 },
]

export const teams = [
  { id: 'platform', name: 'Platform', people: 58, tco2e: 12.2, change: -17 },
  { id: 'design', name: 'Design', people: 34, tco2e: 6.6, change: -15 },
  { id: 'finance', name: 'Finance', people: 41, tco2e: 8.1, change: -12 },
  { id: 'sales', name: 'Sales', people: 67, tco2e: 10.5, change: -8 },
  { id: 'hr', name: 'HR', people: 19, tco2e: 3.3, change: -6 },
  { id: 'ops', name: 'Operations', people: 63, tco2e: 12.8, change: -3 },
  { id: 'legal', name: 'Legal', people: 4, tco2e: 0.6, change: -2 }, // < 5 people → hidden on dashboard
]

export const weeklyTrend = [4.6, 4.6, 4.5, 4.5, 4.4, 4.4, 4.3, 4.3, 4.2, 4.2, 4.1, 3.4].map((t, i) => ({
  week: `W${i + 1}`,
  tco2e: t,
}))

export const sources = [
  { id: 'car', label: 'Car', pct: 38 },
  { id: 'twoWheeler', label: 'Two-wheeler', pct: 21 },
  { id: 'cab', label: 'Cab and auto', pct: 14 },
  { id: 'flights', label: 'Business flights', pct: 12 },
  { id: 'bus', label: 'Bus', pct: 8 },
  { id: 'metro', label: 'Metro and rail', pct: 5 },
  { id: 'office', label: 'Office habits', pct: 2 },
]

export const locations = [
  { id: 'chn', name: 'Chennai campus', tco2e: 22.4, employees: 168, change: -15 },
  { id: 'blr', name: 'Bengaluru office', tco2e: 18.1, employees: 142, change: -12 },
  { id: 'pune', name: 'Pune office', tco2e: 11.0, employees: 90, change: -10 },
]

export const companyKpis = {
  totalTco2e: 51.5,
  changeVsBaseline: -13,
  activeEmployees: 312,
  totalEmployees: 400,
  perActiveKg: 165,
  scope: 'Scope 3, categories 6 and 7',
}

export const seedChallenges = [
  {
    id: 'c1',
    name: 'Metro Month',
    description: 'Employees who switch car trips to metro or bus earn points. Top team wins the reward.',
    reward: 'Extra leave day',
    status: 'live',
    participants: 214,
    eligible: 312,
    daysLeft: 12,
    leaderTeam: 'Platform',
  },
  {
    id: 'c2',
    name: 'Lights-out Fridays',
    description: 'Log an office check-in every Friday for a month.',
    reward: '₹500 voucher',
    status: 'ended',
    participants: 180,
    eligible: 300,
    daysLeft: 0,
    leaderTeam: 'Design',
  },
]
