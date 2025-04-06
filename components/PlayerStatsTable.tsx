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
import type { IPlayer, PlayerStats } from '../src/types'

interface PlayerStatsTableProps {
  players: IPlayer[]
  statsMap: Map<string, PlayerStats>
}

export default function PlayerStatsTable({ players, statsMap }: PlayerStatsTableProps) {
  if (players.length === 0) {
    return (
      <Typography variant="body1">
        No players found.
      </Typography>
    )
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Player</strong></TableCell>
            <TableCell align="right">Matches</TableCell>
            <TableCell align="right">Wins</TableCell>
            <TableCell align="right">Losses</TableCell>
            <TableCell align="right">Win %</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((player) => {
            const stats = statsMap.get(player.id)
            const total = stats?.totalMatches || 0
            const wins = stats?.wins || 0
            const losses = stats?.losses || 0
            const winPercent = stats ? `${stats.winPercentage.toFixed(1)}%` : '0%'

            return (
              <TableRow key={player.id}>
                <TableCell>{player.name}</TableCell>
                <TableCell align="right">{total}</TableCell>
                <TableCell align="right">{wins}</TableCell>
                <TableCell align="right">{losses}</TableCell>
                <TableCell align="right">{winPercent}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
