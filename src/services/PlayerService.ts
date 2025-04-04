import type { IPlayer } from "../types"
import type { IPlayerRepository } from "../repositories/interfaces/IPlayerRepository"

export class PlayerService {
  constructor(private playerRepository: IPlayerRepository) {}

  async getAllPlayers(): Promise<IPlayer[]> {
    return this.playerRepository.findAll()
  }

  async getPlayerById(id: string): Promise<IPlayer | null> {
    return this.playerRepository.findById(id)
  }

  async createPlayer(name: string, email?: string): Promise<IPlayer> {
    return this.playerRepository.create({ name, email })
  }

  async updatePlayer(id: string, data: Partial<IPlayer>): Promise<IPlayer | null> {
    return this.playerRepository.update(id, data)
  }

  async deletePlayer(id: string): Promise<boolean> {
    return this.playerRepository.delete(id)
  }

  async searchPlayersByName(name: string): Promise<IPlayer[]> {
    return this.playerRepository.findByName(name)
  }
}

