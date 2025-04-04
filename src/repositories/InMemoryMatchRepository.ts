import type { IMatch, ITeam } from "../types"
import type { IMatchRepository } from "./interfaces/IMatchRepository"
import { v4 as uuidv4 } from "uuid"

export class InMemoryMatchRepository implements IMatchRepository {
  private matches: IMatch[] = []
  private teams: ITeam[] = []

  async findAll(): Promise<IMatch[]> {
    return [...this.matches]
  }

  async findById(id: string): Promise<IMatch | null> {
    const match = this.matches.find((m) => m.id === id)
    return match || null
  }

  async findByDate(date: Date): Promise<IMatch[]> {
    return this.matches.filter((m) => m.date.toDateString() === date.toDateString())
  }

  async findByPlayerId(playerId: string): Promise<IMatch[]> {
    return this.matches.filter((match) => match.teams.some((team) => team.playerIds.includes(playerId)))
  }

  async findByTeamId(teamId: string): Promise<IMatch[]> {
    return this.matches.filter((match) => match.teams.some((team) => team.id === teamId))
  }

  async create(match: Omit<IMatch, "id" | "createdAt">): Promise<IMatch> {
    const newMatch: IMatch = {
      ...match,
      id: uuidv4(),
      createdAt: new Date(),
    }
    this.matches.push(newMatch)
    return newMatch
  }

  async createTeam(playerIds: [string, string]): Promise<ITeam> {
    // Sort player IDs to ensure consistent team identification
    const sortedPlayerIds = [...playerIds].sort() as [string, string]

    // Check if team already exists
    const existingTeam = await this.findTeamByPlayers(sortedPlayerIds)
    if (existingTeam) return existingTeam

    // Create new team
    const newTeam: ITeam = {
      id: uuidv4(),
      playerIds: sortedPlayerIds,
    }
    this.teams.push(newTeam)
    return newTeam
  }

  async findTeamByPlayers(playerIds: [string, string]): Promise<ITeam | null> {
    // Sort player IDs to ensure consistent team identification
    const sortedPlayerIds = [...playerIds].sort() as [string, string]

    const team = this.teams.find((t) => t.playerIds[0] === sortedPlayerIds[0] && t.playerIds[1] === sortedPlayerIds[1])
    return team || null
  }

  async findAllTeams(): Promise<ITeam[]> {
    return [...this.teams]
  }
}

