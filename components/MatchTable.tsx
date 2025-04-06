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
import type { IMatch, IPlayer } from '../src/types'

interface MatchTableProps {
  matches: IMatch[]
  players: IPlayer[]
}

export default function MatchTable({ matches, players }: MatchTableProps) {
  const getPlayerName = (id: string) => players.find((p) => p.id === id)?.name || 'Unknown'

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString()
  }

  if (matches.length === 0) {
    return (
      <Typography variant="body1" sx={{ mt: 2 }}>
        No matches recorded.
      </Typography>
    )
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Date</strong></TableCell>
            <TableCell><strong>Team 1</strong></TableCell>
            <TableCell><strong>Team 2</strong></TableCell>
            <TableCell><strong>Winner</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {matches.map((match) => {
            const team1 = match.teams[0]
            const team2 = match.teams[1]
            const winner = match.teams.find((t) => t.id === match.winnerTeamId)
            return (
              <TableRow key={match.id}>
                <TableCell>{formatDate(match.date)}</TableCell>
                <TableCell>{team1.playerIds.map(getPlayerName).join(' & ')}</TableCell>
                <TableCell>{team2.playerIds.map(getPlayerName).join(' & ')}</TableCell>
                <TableCell>{winner ? winner.playerIds.map(getPlayerName).join(' & ') : '-'}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
