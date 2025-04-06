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
import type { TeamStats, IPlayer } from '../src/types'

interface TeamStatsTableProps {
  teams: TeamStats[]
  players: IPlayer[]
}

export default function TeamStatsTable({ teams, players }: TeamStatsTableProps) {
  const getPlayerName = (id: string) => players.find((p) => p.id === id)?.name || 'Unknown'

  if (teams.length === 0) {
    return (
      <Typography variant="body1">
        No team statistics available.
      </Typography>
    )
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Team</strong></TableCell>
            <TableCell align="right">Matches</TableCell>
            <TableCell align="right">Wins</TableCell>
            <TableCell align="right">Losses</TableCell>
            <TableCell align="right">Win %</TableCell>
            <TableCell align="right">Win Prob.</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teams.map((team) => {
            const [p1, p2] = team.playerIds.map(getPlayerName)
            return (
              <TableRow key={team.teamId}>
                <TableCell>{`${p1} & ${p2}`}</TableCell>
                <TableCell align="right">{team.totalMatches}</TableCell>
                <TableCell align="right">{team.wins}</TableCell>
                <TableCell align="right">{team.losses}</TableCell>
                <TableCell align="right">{team.winPercentage.toFixed(1)}%</TableCell>
                <TableCell align="right">{team.estimatedWinProbability.toFixed(1)}%</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
