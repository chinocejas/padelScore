import { InMemoryPlayerRepository } from "./repositories/InMemoryPlayerRepository"
import { InMemoryMatchRepository } from "./repositories/InMemoryMatchRepository"
import { LocalStoragePlayerRepository } from "./repositories/LocalStoragePlayerRepository"
import { LocalStorageMatchRepository } from "./repositories/LocalStorageMatchRepository"
import { PlayerService } from "./services/PlayerService"
import { MatchService } from "./services/MatchService"
import { StatisticsService } from "./services/StatisticsService"

// Example usage of the paddle tennis tracking system

async function main() {
  // Initialize repositories
  const playerRepository = new LocalStoragePlayerRepository()
  const matchRepository = new LocalStorageMatchRepository()

  // Initialize services
  const playerService = new PlayerService(playerRepository)
  const matchService = new MatchService(matchRepository, playerRepository)
  const statsService = new StatisticsService(matchRepository, playerRepository)

  // Create players
  console.log("Creating players...")
  const player1 = await playerService.createPlayer("Carlos", "carlos@example.com")
  const player2 = await playerService.createPlayer("Ana", "ana@example.com")
  const player3 = await playerService.createPlayer("Miguel", "miguel@example.com")
  const player4 = await playerService.createPlayer("Laura", "laura@example.com")

  console.log("Players created:")
  console.log(await playerService.getAllPlayers())

  // Create matches
  console.log("\nCreating matches...")

  // Match 1: Carlos & Ana vs Miguel & Laura, Carlos & Ana win
  const match1 = await matchService.createMatch(
    new Date("2023-05-10"),
    [player1.id, player2.id],
    [player3.id, player4.id],
    [player1.id, player2.id],
  )

  // Match 2: Carlos & Miguel vs Ana & Laura, Ana & Laura win
  const match2 = await matchService.createMatch(
    new Date("2023-05-15"),
    [player1.id, player3.id],
    [player2.id, player4.id],
    [player2.id, player4.id],
  )

  // Match 3: Carlos & Laura vs Ana & Miguel, Carlos & Laura win
  const match3 = await matchService.createMatch(
    new Date("2023-05-20"),
    [player1.id, player4.id],
    [player2.id, player3.id],
    [player1.id, player4.id],
  )

  console.log("Matches created:")
  const allMatches = await matchService.getAllMatches()
  console.log(JSON.stringify(allMatches, null, 2))

  // Get player statistics
  console.log("\nPlayer Statistics:")
  for (const player of [player1, player2, player3, player4]) {
    const stats = await statsService.getPlayerStats(player.id)
    console.log(
      `${player.name}: ${stats?.wins} wins, ${stats?.losses} losses, ${stats?.winPercentage.toFixed(2)}% win rate`,
    )
  }

  // Get team statistics
  console.log("\nTeam Statistics:")
  const allTeams = await matchService.getAllTeams()
  for (const team of allTeams) {
    const player1 = await playerService.getPlayerById(team.playerIds[0])
    const player2 = await playerService.getPlayerById(team.playerIds[1])
    const stats = await statsService.getTeamStats(team.playerIds)

    if (player1 && player2 && stats) {
      console.log(
        `${player1.name} & ${player2.name}: ${stats.wins} wins, ${stats.losses} losses, ${stats.winPercentage.toFixed(2)}% win rate`,
      )
    }
  }
}

main().catch(console.error)

