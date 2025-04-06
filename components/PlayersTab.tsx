'use client'

import React from 'react'
import { Paper, Typography, CircularProgress, Alert,Tooltip ,IconButton, Box} from '@mui/material'
import AddPlayerForm from './AddPlayerForm'
import PlayerTable from './PlayerTable'
import { usePlayers } from '../hooks/usePlayers'
import DeleteOutline from '@mui/icons-material/DeleteOutline'

export default function PlayersTab() {
  const { players, loading, error, reload } = usePlayers()

  return (
    <Paper color="primary"  sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Players</Typography>

      <AddPlayerForm onPlayerAdded={reload} />

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error.message}</Alert>}
      {!loading && !error && <PlayerTable players={players} />} 
      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mt: 3,
        }}
        >
      <Tooltip title="Reset app (clear localStorage)">
        <IconButton
          color="error"
          onClick={() => {
            if (confirm('Are you sure you want to reset the app?')) {
              localStorage.clear()
              location.reload()
            }
          }}
        >
          <DeleteOutline />
        </IconButton>
      </Tooltip>
      </Box>
     

    </Paper>
  )
}
