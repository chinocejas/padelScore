import type { IPlayer } from "../types"
import type { IPlayerRepository } from "./interfaces/IPlayerRepository"
import { v4 as uuidv4 } from "uuid"

export class LocalStoragePlayerRepository implements IPlayerRepository {
  private storageKey = "players"

  private getPlayers(): IPlayer[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.storageKey)
    return data ? JSON.parse(data) : []
  }

  private savePlayers(players: IPlayer[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(players))
  }

  async findAll(): Promise<IPlayer[]> {
    return this.getPlayers()
  }

  async findById(id: string): Promise<IPlayer | null> {
    const player = this.getPlayers().find((p) => p.id === id)
    return player || null
  }

  async findByName(name: string): Promise<IPlayer[]> {
    return this.getPlayers().filter((p) =>
      p.name.toLowerCase().includes(name.toLowerCase())
    )
  }

  async create(player: Omit<IPlayer, "id" | "createdAt">): Promise<IPlayer> {
    const newPlayer: IPlayer = {
      ...player,
      id: uuidv4(),
      createdAt: new Date(),
    }
    const players = this.getPlayers()
    players.push(newPlayer)
    this.savePlayers(players)
    return newPlayer
  }

  async update(id: string, playerData: Partial<IPlayer>): Promise<IPlayer | null> {
    const players = this.getPlayers()
    const index = players.findIndex((p) => p.id === id)
    if (index === -1) return null

    const updatedPlayer = {
      ...players[index],
      ...playerData,
    }
    players[index] = updatedPlayer
    this.savePlayers(players)
    return updatedPlayer
  }

  async delete(id: string): Promise<boolean> {
    const players = this.getPlayers()
    const filtered = players.filter((p) => p.id !== id)
    this.savePlayers(filtered)
    return filtered.length !== players.length
  }
}
