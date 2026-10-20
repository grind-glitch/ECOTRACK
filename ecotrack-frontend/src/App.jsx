import { Navigate, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing.jsx'

// Employee app
import { EmployeeProvider } from './store/EmployeeContext.jsx'
import EmployeeLayout from './employee/EmployeeLayout.jsx'
import Onboarding from './employee/Onboarding.jsx'
import Home from './employee/Home.jsx'
import LogTrip from './employee/LogTrip.jsx'
import Leaderboard from './employee/Leaderboard.jsx'

// Company dashboard
import DashboardLayout from './dashboard/DashboardLayout.jsx'
import Overview from './dashboard/Overview.jsx'
import Teams from './dashboard/Teams.jsx'
import Locations from './dashboard/Locations.jsx'
import Challenges from './dashboard/Challenges.jsx'
import Reports from './dashboard/Reports.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/app" element={<EmployeeProvider><EmployeeLayout /></EmployeeProvider>}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="onboarding" element={<Onboarding />} />
        <Route path="home" element={<Home />} />
        <Route path="log" element={<LogTrip />} />
        <Route path="ranks" element={<Leaderboard />} />
      </Route>

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Overview />} />
        <Route path="teams" element={<Teams />} />
        <Route path="locations" element={<Locations />} />
        <Route path="challenges" element={<Challenges />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
