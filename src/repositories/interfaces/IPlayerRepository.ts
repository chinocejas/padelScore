import type { IPlayer } from "../../types"

export interface IPlayerRepository {
  findAll(): Promise<IPlayer[]>
  findById(id: string): Promise<IPlayer | null>
  findByName(name: string): Promise<IPlayer[]>
  create(player: Omit<IPlayer, "id" | "createdAt">): Promise<IPlayer>
  update(id: string, player: Partial<IPlayer>): Promise<IPlayer | null>
  delete(id: string): Promise<boolean>
}

