import type { IMatch, ITeam } from "../types"
import type { IMatchRepository } from "../repositories/interfaces/IMatchRepository"
import type { IPlayerRepository } from "../repositories/interfaces/IPlayerRepository"

export class MatchService {
  constructor(
    private matchRepository: IMatchRepository,
    private playerRepository: IPlayerRepository,
  ) {}

  async getAllMatches(): Promise<IMatch[]> {
    return this.matchRepository.findAll()
  }

  async getMatchById(id: string): Promise<IMatch | null> {
    return this.matchRepository.findById(id)
  }

  async getMatchesByDate(date: Date): Promise<IMatch[]> {
    return this.matchRepository.findByDate(date)
  }

  async getMatchesByPlayerId(playerId: string): Promise<IMatch[]> {
    return this.matchRepository.findByPlayerId(playerId)
  }

  async createMatch(
    date: Date,
    team1PlayerIds: [string, string],
    team2PlayerIds: [string, string],
    winningTeamPlayerIds: [string, string],
  ): Promise<IMatch> {
    // Validate players exist
    const allPlayerIds = [...team1PlayerIds, ...team2PlayerIds]
    for (const playerId of allPlayerIds) {
      const player = await this.playerRepository.findById(playerId)
      if (!player) {
        throw new Error(`Player with ID ${playerId} not found`)
      }
    }

    // Create or get teams
    const team1 = await this.matchRepository.createTeam(team1PlayerIds)
    const team2 = await this.matchRepository.createTeam(team2PlayerIds)

    // Determine winner team ID
    let winnerTeamId: string
    if (
      (team1.playerIds[0] === winningTeamPlayerIds[0] && team1.playerIds[1] === winningTeamPlayerIds[1]) ||
      (team1.playerIds[0] === winningTeamPlayerIds[1] && team1.playerIds[1] === winningTeamPlayerIds[0])
    ) {
      winnerTeamId = team1.id
    } else if (
      (team2.playerIds[0] === winningTeamPlayerIds[0] && team2.playerIds[1] === winningTeamPlayerIds[1]) ||
      (team2.playerIds[0] === winningTeamPlayerIds[1] && team2.playerIds[1] === winningTeamPlayerIds[0])
    ) {
      winnerTeamId = team2.id
    } else {
      throw new Error("Winning team must be one of the participating teams")
    }

    // Create match
    return this.matchRepository.create({
      date,
      teams: [team1, team2],
      winnerTeamId,
    })
  }

  async getAllTeams(): Promise<ITeam[]> {
    return this.matchRepository.findAllTeams()
  }
}

