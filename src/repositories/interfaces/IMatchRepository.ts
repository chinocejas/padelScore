import type { IMatch, ITeam } from "../../types"

export interface IMatchRepository {
  findAll(): Promise<IMatch[]>
  findById(id: string): Promise<IMatch | null>
  findByDate(date: Date): Promise<IMatch[]>
  findByPlayerId(playerId: string): Promise<IMatch[]>
  findByTeamId(teamId: string): Promise<IMatch[]>
  create(match: Omit<IMatch, "id" | "createdAt">): Promise<IMatch>
  createTeam(playerIds: [string, string]): Promise<ITeam>
  findTeamByPlayers(playerIds: [string, string]): Promise<ITeam | null>
  findAllTeams(): Promise<ITeam[]>
}

