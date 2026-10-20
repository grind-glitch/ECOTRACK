import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

// Shared loader for dashboard pages (swap for React Query later if you like)
export function useOverview() {
  const [data, setData] = useState(null)
  useEffect(() => { api.getOverview().then(setData) }, [])
  return data
}
