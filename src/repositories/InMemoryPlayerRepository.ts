import type { IPlayer } from "../types"
import type { IPlayerRepository } from "./interfaces/IPlayerRepository"
import { v4 as uuidv4 } from "uuid"

export class InMemoryPlayerRepository implements IPlayerRepository {
  private players: IPlayer[] = []

  async findAll(): Promise<IPlayer[]> {
    return [...this.players]
  }

  async findById(id: string): Promise<IPlayer | null> {
    const player = this.players.find((p) => p.id === id)
    return player || null
  }

  async findByName(name: string): Promise<IPlayer[]> {
    return this.players.filter((p) => p.name.toLowerCase().includes(name.toLowerCase()))
  }

  async create(player: Omit<IPlayer, "id" | "createdAt">): Promise<IPlayer> {
    const newPlayer: IPlayer = {
      ...player,
      id: uuidv4(),
      createdAt: new Date(),
    }
    this.players.push(newPlayer)
    return newPlayer
  }

  async update(id: string, playerData: Partial<IPlayer>): Promise<IPlayer | null> {
    const index = this.players.findIndex((p) => p.id === id)
    if (index === -1) return null

    const updatedPlayer = {
      ...this.players[index],
      ...playerData,
    }
    this.players[index] = updatedPlayer
    return updatedPlayer
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.players.length
    this.players = this.players.filter((p) => p.id !== id)
    return this.players.length !== initialLength
  }
}

