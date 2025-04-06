'use client'

import React from 'react'
import { Paper, Typography, CircularProgress, Box } from '@mui/material'
import { useStatistics } from '../hooks/useStatistics'
import PlayerStatsTable from './PlayerStatsTable'
import TeamStatsTable from './TeamStatsTable'

export default function StatisticsTab() {
  const { loading, players, playerStatsMap, teamStats } = useStatistics()

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" mb={3}>Statistics</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Box mb={6}>
            <Typography variant="h6" gutterBottom>Player Statistics</Typography>
            <PlayerStatsTable players={players} statsMap={playerStatsMap} />
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>Team Statistics</Typography>
            <TeamStatsTable teams={teamStats} players={players} />
          </Box>
        </>
      )}
    </Paper>
  )
}
