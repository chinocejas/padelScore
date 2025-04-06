'use client'

import React from 'react'
import { Paper, Typography, CircularProgress, Alert } from '@mui/material'
import AddPlayerForm from './AddPlayerForm'
import PlayerTable from './PlayerTable'
import { usePlayers } from '../hooks/usePlayers'

export default function PlayersTab() {
  const { players, loading, error, reload } = usePlayers()

  return (
    <Paper color="primary"  sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Players</Typography>

      <AddPlayerForm onPlayerAdded={reload} />

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error.message}</Alert>}
      {!loading && !error && <PlayerTable players={players} />}
    </Paper>
  )
}
