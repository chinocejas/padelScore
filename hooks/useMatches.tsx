import { useState, useEffect, useCallback } from 'react'
import { matchService } from '../src/services'
import type { IMatch } from '../src/types'

export function useMatches() {
  const [matches, setMatches] = useState<IMatch[]>([])
  const [loading, setLoading] = useState(true)

  const loadMatches = useCallback(async () => {
    setLoading(true)
    const all = await matchService.getAllMatches()
    setMatches(all)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadMatches()
  }, [loadMatches])

  return { matches, loading, reload: loadMatches }
}
