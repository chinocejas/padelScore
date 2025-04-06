import { useState, useEffect } from 'react'
import { statsService } from '../src/services'
import { playerService } from '../src/services'
import type { PlayerStats, TeamStats, IPlayer } from '../src/types'

export function useStatistics() {
  const [playerStatsMap, setPlayerStatsMap] = useState<Map<string, PlayerStats>>(new Map())
  const [teamStats, setTeamStats] = useState<TeamStats[]>([])
  const [players, setPlayers] = useState<IPlayer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const allPlayers = await playerService.getAllPlayers()
      const map = new Map<string, PlayerStats>()
      for (const player of allPlayers) {
        const stats = await statsService.getPlayerStats(player.id)
        if (stats) map.set(player.id, stats)
      }
      const teams = await statsService.getAllTeamStats()

      setPlayerStatsMap(map)
      setTeamStats(teams)
      setPlayers(allPlayers)
      setLoading(false)
    }

    load()
  }, [])

  return { loading, players, playerStatsMap, teamStats }
}
