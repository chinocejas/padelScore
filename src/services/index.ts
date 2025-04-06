import { PlayerService } from './PlayerService'
import { MatchService } from './MatchService'
import { StatisticsService } from './StatisticsService'
import { playerRepository, matchRepository } from '../repositories/repositories'

export const playerService = new PlayerService(playerRepository)
export const matchService = new MatchService(matchRepository, playerRepository)
export const statsService = new StatisticsService(matchRepository, playerRepository)
