'use client'

import React, { useState } from 'react'
import { Box, TextField, Button } from '@mui/material'
import { playerService } from '../src/services'

interface AddPlayerFormProps {
  onPlayerAdded: () => void
}

export default function AddPlayerForm({ onPlayerAdded }: AddPlayerFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim()) return

    try {
      await playerService.createPlayer(name.trim(), email.trim() || undefined)
      setName('')
      setEmail('')
      onPlayerAdded() // Esto llama a reload() desde usePlayers
    } catch (error) {
      console.error('Error adding player:', error)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Name"
          variant="outlined"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email (optional)"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" variant="contained">
          Add Player
        </Button>
      </Box>
    </Box>
  )
}
