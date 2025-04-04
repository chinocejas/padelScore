import type { PlayerStats, TeamStats } from "../types"
import type { IMatchRepository } from "../repositories/interfaces/IMatchRepository"
import type { IPlayerRepository } from "../repositories/interfaces/IPlayerRepository"

export class StatisticsService {
  constructor(
    private matchRepository: IMatchRepository,
    private playerRepository: IPlayerRepository,
  ) {}

  async getPlayerStats(playerId: string): Promise<PlayerStats | null> {
    // Verify player exists
    const player = await this.playerRepository.findById(playerId)
    if (!player) return null

    // Get all matches for this player
    const matches = await this.matchRepository.findByPlayerId(playerId)

    // Calculate statistics
    const totalMatches = matches.length
    let wins = 0

    for (const match of matches) {
      // Find which team the player was on
      const playerTeam = match.teams.find((team) => team.playerIds.includes(playerId))

      if (playerTeam && playerTeam.id === match.winnerTeamId) {
        wins++
      }
    }

    const losses = totalMatches - wins
    const winPercentage = totalMatches > 0 ? (wins / totalMatches) * 100 : 0

    return {
      playerId,
      totalMatches,
      wins,
      losses,
      winPercentage,
    }
  }

  async getTeamStats(playerIds: [string, string]): Promise<TeamStats | null> {
    // Find or create team
    const team = await this.matchRepository.findTeamByPlayers(playerIds)
    if (!team) return null

    // Get all matches for this team
    const matches = await this.matchRepository.findByTeamId(team.id)

    // Calculate statistics
    const totalMatches = matches.length
    let wins = 0

    for (const match of matches) {
      if (match.winnerTeamId === team.id) {
        wins++
      }
    }

    const losses = totalMatches - wins
    const winPercentage = totalMatches > 0 ? (wins / totalMatches) * 100 : 0

    // Calculate estimated win probability based on past performance
    // This is a simple implementation - could be enhanced with more sophisticated algorithms
    const estimatedWinProbability = winPercentage

    return {
      teamId: team.id,
      playerIds: team.playerIds,
      totalMatches,
      wins,
      losses,
      winPercentage,
      estimatedWinProbability,
    }
  }

  async getAllTeamStats(): Promise<TeamStats[]> {
    const teams = await this.matchRepository.findAllTeams()
    const statsPromises = teams.map((team) => this.getTeamStats(team.playerIds))
    const stats = await Promise.all(statsPromises)
    return stats.filter((stat): stat is TeamStats => stat !== null)
  }
}

