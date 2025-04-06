'use client'

import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  } from '@mui/material'
import Grid from '@mui/material/Grid'
import { usePlayers } from '../hooks/usePlayers'
import { useMatches } from '../hooks/useMatches'
import { matchService } from '../src/services'
import MatchTable from './MatchTable'
import type { IPlayer } from '../src/types'

export default function MatchesTab() {
  const { players, loading: loadingPlayers } = usePlayers()
  const { matches, loading: loadingMatches, reload } = useMatches()

  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [winningTeamIndex, setWinningTeamIndex] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const togglePlayer = (id: string) => {
    setSelectedPlayers((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : prev.length < 4 ? [...prev, id] : prev
    )
  }

  const handleSaveMatch = async () => {
    if (selectedPlayers.length !== 4 || winningTeamIndex === null) return
    try {
      setSaving(true)
      const team1 = [selectedPlayers[0], selectedPlayers[1]] as [string, string]
      const team2 = [selectedPlayers[2], selectedPlayers[3]] as [string, string]
      const winners = winningTeamIndex === 0 ? team1 : team2
      await matchService.createMatch(new Date(), team1, team2, winners)
      setSelectedPlayers([])
      setWinningTeamIndex(null)
      await reload()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const getPlayerName = (id: string) => players.find((p) => p.id === id)?.name || 'Unknown'

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" mb={3}>Record New Match</Typography>

      {loadingPlayers ? (
        <CircularProgress />
      ) : (
        <>
          <Typography>Select 4 Players:</Typography>
          <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                my: 2,
            }}
            >
            {players.map((player) => (
                <Box
                key={player.id}
                sx={{
                    width: { xs: '48%', sm: '23%' },
                    minWidth: '120px',
                }}
                >
                <Button
                    variant={selectedPlayers.includes(player.id) ? 'contained' : 'outlined'}
                    fullWidth
                    onClick={() => togglePlayer(player.id)}
                >
                    {player.name}
                </Button>
                </Box>
            ))}
            </Box>

          {selectedPlayers.length === 4 && (
            <Box sx={{ mb: 2 }}>
              <Typography>Select Winning Team:</Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                {[0, 1].map((index) => {
                  const team = selectedPlayers.slice(index * 2, index * 2 + 2)
                  return (
                    <Button
                      key={index}
                      variant={winningTeamIndex === index ? 'contained' : 'outlined'}
                      onClick={() => setWinningTeamIndex(index)}
                    >
                      {team.map(getPlayerName).join(' & ')}
                    </Button>
                  )
                })}
              </Box>
            </Box>
          )}

          <Button
            variant="contained"
            onClick={handleSaveMatch}
            disabled={selectedPlayers.length !== 4 || winningTeamIndex === null || saving}
          >
            {saving ? 'Saving...' : 'Record Match'}
          </Button>
        </>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Previous Matches</Typography>
        {loadingMatches ? <CircularProgress /> : <MatchTable matches={matches} players={players} />}
      </Box>
    </Paper>
  )
}
