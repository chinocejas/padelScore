import type { IMatch, ITeam } from "../types"
import type { IMatchRepository } from "./interfaces/IMatchRepository"
import { v4 as uuidv4 } from "uuid"

export class LocalStorageMatchRepository implements IMatchRepository {
  private matchKey = "matches"
  private teamKey = "teams"

  private getMatches(): IMatch[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.matchKey)
    return data ? JSON.parse(data, this.dateReviver) : []
  }

  private saveMatches(matches: IMatch[]) {
    localStorage.setItem(this.matchKey, JSON.stringify(matches))
  }

  private getTeams(): ITeam[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.teamKey)
    return data ? JSON.parse(data) : []
  }

  private saveTeams(teams: ITeam[]) {
    localStorage.setItem(this.teamKey, JSON.stringify(teams))
  }

  private dateReviver(key: string, value: any) {
    if (key === "date" || key === "createdAt") {
      return new Date(value)
    }
    return value
  }

  async findAll(): Promise<IMatch[]> {
    return this.getMatches()
  }

  async findById(id: string): Promise<IMatch | null> {
    const match = this.getMatches().find((m) => m.id === id)
    return match || null
  }

  async findByDate(date: Date): Promise<IMatch[]> {
    return this.getMatches().filter((m) => m.date.toDateString() === date.toDateString())
  }

  async findByPlayerId(playerId: string): Promise<IMatch[]> {
    return this.getMatches().filter((match) =>
      match.teams.some((team) => team.playerIds.includes(playerId))
    )
  }

  async findByTeamId(teamId: string): Promise<IMatch[]> {
    return this.getMatches().filter((match) =>
      match.teams.some((team) => team.id === teamId)
    )
  }

  async create(match: Omit<IMatch, "id" | "createdAt">): Promise<IMatch> {
    const newMatch: IMatch = {
      ...match,
      id: uuidv4(),
      createdAt: new Date(),
    }
    const matches = this.getMatches()
    matches.push(newMatch)
    this.saveMatches(matches)
    return newMatch
  }

  async createTeam(playerIds: [string, string]): Promise<ITeam> {
    const sorted = [...playerIds].sort() as [string, string]
    const existing = await this.findTeamByPlayers(sorted)
    if (existing) return existing

    const newTeam: ITeam = {
      id: uuidv4(),
      playerIds: sorted,
    }
    const teams = this.getTeams()
    teams.push(newTeam)
    this.saveTeams(teams)
    return newTeam
  }

  async findTeamByPlayers(playerIds: [string, string]): Promise<ITeam | null> {
    const sorted = [...playerIds].sort() as [string, string]
    const team = this.getTeams().find(
      (t) => t.playerIds[0] === sorted[0] && t.playerIds[1] === sorted[1]
    )
    return team || null
  }

  async findAllTeams(): Promise<ITeam[]> {
    return this.getTeams()
  }
}
