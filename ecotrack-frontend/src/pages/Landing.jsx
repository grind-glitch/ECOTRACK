import { Link } from 'react-router-dom'
import { Icon, Logo } from '../components/ui.jsx'
import { api, isMockMode } from '../lib/api.js'

// Entry page for the demo: judges pick which side of the product to open.
export default function Landing() {
  return (
    <div className="min-h-full bg-canvas">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:py-20">
        <Logo />
        <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">
          Measure and cut employee emissions,<br className="hidden sm:block" /> fairly and privately.
        </h1>
        <p className="mt-3 max-w-2xl text-ink-600">
          Employees track commutes and office habits and are ranked by improvement against their own baseline.
          The company sees only team totals, ready for BRSR Scope 3 reporting.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Entry
            to="/app"
            icon="Smartphone"
            title="Employee app"
            text="Baseline survey, home, trip logging and the improvement leaderboard."
          />
          <Entry
            to="/dashboard"
            icon="Monitor"
            title="Company dashboard"
            text="Emissions overview, teams, locations, challenges and BRSR report export."
          />
        </div>

        {isMockMode && (
          <div className="mt-10 flex flex-wrap items-center gap-3 text-xs text-ink-400">
            <span>Running on sample data stored in this browser.</span>
            <button
              className="underline hover:text-ink"
              onClick={async () => { await api.resetDemo(); location.href = '/app/onboarding' }}
            >
              Reset demo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Entry({ to, icon, title, text }) {
  return (
    <Link to={to} className="group rounded-2xl border border-line bg-white p-6 transition hover:border-leaf">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-leaf-100 text-leaf">
        <Icon name={icon} />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Icon name="ArrowRight" className="text-ink-400 transition group-hover:translate-x-1 group-hover:text-leaf" />
      </div>
      <p className="mt-1 text-sm text-ink-600">{text}</p>
    </Link>
  )
}
