// src/repositories/index.ts
import { LocalStoragePlayerRepository } from "./LocalStoragePlayerRepository"
import { LocalStorageMatchRepository } from "./LocalStorageMatchRepository"

export const playerRepository = new LocalStoragePlayerRepository()
export const matchRepository = new LocalStorageMatchRepository()
