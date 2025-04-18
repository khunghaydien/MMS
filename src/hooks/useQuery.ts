import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

// query string - search params
export function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}
