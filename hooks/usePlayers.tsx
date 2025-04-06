import { useState, useEffect, useCallback } from 'react'
import { playerService } from '../src/services'
import type { IPlayer } from '../src/types'

export function usePlayers() {
  const [players, setPlayers] = useState<IPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadPlayers = useCallback(async () => {
    setLoading(true)
    try {
      const allPlayers = await playerService.getAllPlayers()
      setPlayers(allPlayers)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPlayers()
  }, [loadPlayers])

  return { players, loading, error, reload: loadPlayers }
}
