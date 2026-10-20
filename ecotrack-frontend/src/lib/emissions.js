// ─────────────────────────────────────────────────────────────
// EcoTrack emission engine (frontend copy)
//
// Every activity is: distance (km) × factor (kg CO2e per passenger-km).
// Office habits are fixed savings per check-in.
//
// ⚠ The numbers below are PLACEHOLDER estimates so the prototype runs.
//   Before submission, replace them with the India GHG Program road/rail
//   factors and the CEA grid factor (links are in the write-up), and keep
//   the source + year next to each value.
//   Later this file moves to the backend; the frontend will only display results.
// ─────────────────────────────────────────────────────────────

export const MODES = {
  walk:       { label: 'Walk',        factor: 0,     icon: 'Footprints' },
  cycle:      { label: 'Cycle',       factor: 0,     icon: 'Bike' },
  metro:      { label: 'Metro',       factor: 0.040, icon: 'TrainFront' },
  bus:        { label: 'Bus',         factor: 0.035, icon: 'Bus' },
  auto:       { label: 'Auto',        factor: 0.060, icon: 'CarTaxiFront' },
  twoWheeler: { label: 'Two-wheeler', factor: 0.045, icon: 'Bike' },
  car:        { label: 'Car',         factor: 0.170, icon: 'Car' },
  cab:        { label: 'Cab',         factor: 0.180, icon: 'CarFront' },
}

// Modes offered in the baseline survey (grouped like the mockup)
export const BASELINE_MODES = [
  { id: 'car', label: 'Car' },
  { id: 'twoWheeler', label: 'Two-wheeler' },
  { id: 'metro', label: 'Metro or train' },
  { id: 'bus', label: 'Bus' },
  { id: 'cab', label: 'Cab or auto' },
  { id: 'walk', label: 'Walk or cycle' },
]

// Office-habit check-ins: kg CO2e saved per check-in (placeholder values)
export const HABITS = {
  acOff:       { label: 'AC off when leaving', saves: 0.5 },
  lightsOff:   { label: 'Lights off',          saves: 0.1 },
  noPrinting:  { label: 'No printing today',   saves: 0.05 },
  zeroWaste:   { label: 'Zero food waste',     saves: 0.3 },
}

const round = (n, d = 1) => Math.round(n * 10 ** d) / 10 ** d

/** kg CO2e for one trip */
export function tripEmissions(mode, km) {
  const f = MODES[mode]?.factor ?? 0
  return round(f * Number(km || 0), 2)
}

/** kg CO2e saved vs doing the same trip by car */
export function savedVsCar(mode, km) {
  return round(tripEmissions('car', km) - tripEmissions(mode, km), 2)
}

/** Weekly baseline from the onboarding survey (to office and back) */
export function weeklyBaseline({ mode, km, officeDays }) {
  return round(tripEmissions(mode, km) * 2 * officeDays, 1)
}

/** % change vs baseline. Negative = improvement (shown as "-14%"). */
export function changeVsBaseline(actual, baseline) {
  if (!baseline) return 0
  return Math.round(((actual - baseline) / baseline) * 100)
}

/** Total emissions for a list of trips, minus habit savings */
export function totalFor(trips = [], checkins = []) {
  const t = trips.reduce((s, x) => s + tripEmissions(x.mode, x.km), 0)
  const h = checkins.reduce((s, c) => s + (HABITS[c.habit]?.saves ?? 0), 0)
  return round(Math.max(0, t - h), 1)
}

/**
 * Rule-based tip: find the biggest source and suggest a realistic switch.
 * ML can replace this later without changing the screen.
 */
export function biggestSourceTip(trips = []) {
  const byMode = {}
  for (const t of trips) byMode[t.mode] = (byMode[t.mode] || 0) + tripEmissions(t.mode, t.km)
  const top = Object.entries(byMode).sort((a, b) => b[1] - a[1])[0]
  if (!top || top[1] === 0) return null
  const [mode] = top
  if (!['car', 'cab', 'twoWheeler', 'auto'].includes(mode)) return null
  const commutes = trips.filter((t) => t.mode === mode)
  const avgKm = commutes.reduce((s, t) => s + Number(t.km), 0) / commutes.length
  // switching 2 days a week (4 one-way trips) for ~4.3 weeks
  const monthly = round((tripEmissions(mode, avgKm) - tripEmissions('metro', avgKm)) * 4 * 4.3, 0)
  return {
    mode,
    text: `Your biggest source is ${MODES[mode].label.toLowerCase()} travel. Taking the metro 2 days a week would save about ${monthly} kg CO₂e a month.`,
  }
}
