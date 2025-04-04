// Common types used across the application

export interface IPlayer {
  id: string
  name: string
  email?: string
  createdAt: Date
}

export interface ITeam {
  id: string
  playerIds: [string, string] // Exactly two players
}

export interface IMatch {
  id: string
  date: Date
  teams: [ITeam, ITeam] // Exactly two teams
  winnerTeamId: string
  createdAt: Date
}

export interface PlayerStats {
  playerId: string
  totalMatches: number
  wins: number
  losses: number
  winPercentage: number
}

export interface TeamStats {
  teamId: string
  playerIds: [string, string]
  totalMatches: number
  wins: number
  losses: number
  winPercentage: number
  estimatedWinProbability: number
}

