# EcoTrack — frontend

Workplace carbon-footprint tracker. One React codebase with two front ends:

| URL | What it is |
|---|---|
| `/` | Demo landing page (pick a side) |
| `/app` | **Employee app** (phone layout): baseline survey → home → log a trip → leaderboard |
| `/dashboard` | **Company dashboard** (web): overview, teams, locations, challenges and rewards, BRSR report |

It runs fully offline on sample data stored in the browser, so you can demo it before the backend exists.

## Run it

Needs Node.js 18 or newer.

```bash
npm install
npm run dev        # opens http://localhost:5173
```

`npm run build` makes a production build in `dist/` (deploy that folder to Vercel or Netlify).
To restart the demo from the onboarding screen, use **Reset demo** on the landing page.

## Folder map

```
src/
  lib/emissions.js        emission engine: factors, trip CO2, baseline, % change, tips
  lib/api.js              ALL data calls (mock now, real backend later)
  lib/csv.js              CSV download helper
  data/mock.js            sample company, people, teams, trips
  store/EmployeeContext   employee state shared by the 4 app screens
  components/ui.jsx       buttons, cards, chips, icons, colours
  employee/               Onboarding, Home, LogTrip, Leaderboard, layout + tab bar
  dashboard/              Overview, Teams, Locations, Challenges, Reports, layout + sidebar
  pages/Landing.jsx
```

Colours live in `tailwind.config.js` (`forest`, `leaf`, `sun`, `ink`).

## Before you submit

**Emission factors are placeholders.** Replace the numbers in `src/lib/emissions.js` (`MODES` and `HABITS`) with the India GHG Program road and rail factors and the CEA grid factor, and note the source and year beside each. The BRSR report page reads from the same table, so it updates automatically.

## Connecting the backend later

The screens never fetch data directly; they only call `api.*` in `src/lib/api.js`.
When your API is ready:

1. Copy `.env.example` to `.env` and set `VITE_API_URL=http://localhost:4000/api`
2. Implement these endpoints (JSON in, JSON out). Nothing in the UI changes.

| Method | Path | Used by |
|---|---|---|
| GET | `/me` | profile + baseline |
| PUT | `/me/baseline` | onboarding `{ mode, km, officeDays, autoDetect }` |
| GET / POST | `/me/trips` | trip list / log a trip `{ date, mode, km, label }` |
| PATCH | `/me/trips/:id` | confirm or edit an auto-detected trip |
| GET / POST | `/me/checkins` | office habits `{ date, habits: [] }` |
| GET | `/me/stats` | streak, saved this month |
| GET | `/leaderboard?kind=people\|teams` | ranks by % change vs own baseline |
| GET | `/company/overview` | KPIs, trend, sources, teams, locations (aggregates only) |
| GET / POST | `/company/challenges` | list / create |
| PATCH | `/company/challenges/:id` | assign reward |

**Privacy rule to enforce on the server:** company endpoints return team and company totals only, never individual trips, and drop any team with fewer than 5 people.

## Roadmap (shown as "next" in the pitch)

- Auth: company-email sign-in (Firebase Auth or JWT)
- Move `emissions.js` to the backend; frontend only displays results
- Automatic trip detection in the React Native app (activity recognition, not continuous GPS)
- Scheduled weekly and monthly summaries
- Employee app as React Native: each file in `src/employee/` maps to one native screen
