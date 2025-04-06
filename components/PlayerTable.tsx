'use client'

import React from 'react'
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Typography,
} from '@mui/material'
import type { IPlayer } from '../src/types'

interface PlayerTableProps {
  players: IPlayer[]
}

export default function PlayerTable({ players }: PlayerTableProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString()
  }

  if (players.length === 0) {
    return (
      <Typography variant="body1" sx={{ mt: 2 }}>
        No players found.
      </Typography>
    )
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell><strong>Email</strong></TableCell>
            <TableCell><strong>Joined</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id}>
              <TableCell>{player.name}</TableCell>
              <TableCell>{player.email || '-'}</TableCell>
              <TableCell>{formatDate(player.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
