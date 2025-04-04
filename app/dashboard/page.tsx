"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { PlayerService } from "../../src/services/PlayerService"
import { MatchService } from "../../src/services/MatchService"
import { StatisticsService } from "../../src/services/StatisticsService"
import type { IPlayer, IMatch, PlayerStats, TeamStats } from "../../src/types"
import { playerRepository, matchRepository } from "../../src/repositories/repositories"
import { ThemeToggle } from "../../components/theme-toggle"
// Initialize repositories and services
const playerService = new PlayerService(playerRepository)
const matchService = new MatchService(matchRepository, playerRepository)
const statsService = new StatisticsService(matchRepository, playerRepository)
export default function Dashboard() {
  // State for players
  const [players, setPlayers] = useState<IPlayer[]>([])
  const [newPlayerName, setNewPlayerName] = useState("")
  const [newPlayerEmail, setNewPlayerEmail] = useState("")
  // State for matches
  const [matches, setMatches] = useState<IMatch[]>([])
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [winningTeamIndex, setWinningTeamIndex] = useState<number | null>(null)
  // State for statistics
  const [playerStats, setPlayerStats] = useState<Map<string, PlayerStats>>(new Map())
  const [teamStats, setTeamStats] = useState<TeamStats[]>([])
  // State for UI
  const [activeTab, setActiveTab] = useState("players")
  const [isLoading, setIsLoading] = useState(true)
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Create some sample players if none exist
        const existingPlayers = await playerService.getAllPlayers()
        if (existingPlayers.length === 0) {
            const res = await fetch("data/default_players.json")
            const playersFromJson: { name: string; email: string }[] = await res.json()
            for (const p of playersFromJson) {
              await playerService.createPlayer(p.name, p.email)
            }
        }
        // Refresh data
        await refreshData()
      } catch (error) {
        console.error("Error loading initial data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])
  // Refresh all data
  const refreshData = async () => {
    const allPlayers = await playerService.getAllPlayers()
    setPlayers(allPlayers)
    const allMatches = await matchService.getAllMatches()
    setMatches(allMatches)
    // Load player stats
    const stats = new Map<string, PlayerStats>()
    for (const player of allPlayers) {
      const playerStat = await statsService.getPlayerStats(player.id)
      if (playerStat) {
        stats.set(player.id, playerStat)
      }
    }
    setPlayerStats(stats)
    // Load team stats
    const allTeamStats = await statsService.getAllTeamStats()
    setTeamStats(allTeamStats)
  }
  // Add a new player
  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPlayerName.trim()) {
      await playerService.createPlayer(newPlayerName, newPlayerEmail || undefined)
      setNewPlayerName("")
      setNewPlayerEmail("")
      await refreshData()
    }
  }
  // Record a new match
  const handleRecordMatch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedPlayers.length === 4 && winningTeamIndex !== null) {
      try {
        const team1: [string, string] = [selectedPlayers[0], selectedPlayers[1]] as [string, string]
        const team2: [string, string] = [selectedPlayers[2], selectedPlayers[3]] as [string, string]
        // Use the winning team based on the index
        const winners = winningTeamIndex === 0 ? team1 : team2
        await matchService.createMatch(new Date(), team1, team2, winners)
        setSelectedPlayers([])
        setWinningTeamIndex(null)
        await refreshData()
      } catch (error) {
        console.error("Error recording match:", error)
        alert("Error recording match. Please check the console for details.")
      }
    } else {
      alert("Please select 4 players and indicate the winning team")
    }
  }
  // Toggle player selection for match recording
  const togglePlayerSelection = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId))
    } else if (selectedPlayers.length < 4) {
      setSelectedPlayers([...selectedPlayers, playerId])
    }
  }
  const selectWinningTeam = (teamIndex: number) => {
    setWinningTeamIndex(teamIndex)
  }
  // Get player name by ID
  const getPlayerName = (id: string) => {
    return players.find((p) => p.id === id)?.name || "Unknown Player"
  }
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString()
  }
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }
  return (
    <div className="container mx-auto px-4 py-8">
        <ThemeToggle></ThemeToggle> 
      <h1 className="text-3xl font-bold mb-6">Paddle Score</h1>
      
      {/* Navigation Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${activeTab === "players" ? "border-b-2 border-blue-500 font-medium" : ""}`}
          onClick={() => setActiveTab("players")}
        >
          Players
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "matches" ? "border-b-2 border-blue-500 font-medium" : ""}`}
          onClick={() => setActiveTab("matches")}
        >
          Matches
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "stats" ? "border-b-2 border-blue-500 font-medium" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          Statistics
        </button>
      </div>
      {/* Players Tab */}
      {activeTab === "players" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Players</h2>
          {/* Add Player Form */}
          <form onSubmit={handleAddPlayer} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Add New Player</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Player name"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Email (optional)</label>
                <input
                  type="email"
                  value={newPlayerEmail}
                  onChange={(e) => setNewPlayerEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Email address"
                />
              </div>
              <div className="flex items-end">
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Add Player
                </button>
              </div>
            </div>
          </form>
          {/* Players List */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Joined</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.id}>
                    <td className="px-4 py-2 border">{player.name}</td>
                    <td className="px-4 py-2 border">{player.email || "-"}</td>
                    <td className="px-4 py-2 border">{formatDate(player.createdAt)}</td>
                  </tr>
                ))}
                {players.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-center">
                      No players found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Matches Tab */}
      {activeTab === "matches" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Matches</h2>
          {/* Record Match Form */}
          <form onSubmit={handleRecordMatch} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Record New Match</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select 4 Players</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className={`
                      p-2 border rounded-md cursor-pointer
                      ${selectedPlayers.includes(player.id) ? "bg-blue-100 border-blue-500" : ""}
                    `}
                    onClick={() => togglePlayerSelection(player.id)}
                  >
                    {player.name}
                  </div>
                ))}
              </div>
            </div>
            {selectedPlayers.length === 4 && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Winning Team</label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`
                      p-4 border rounded-md cursor-pointer text-center
                      ${winningTeamIndex === 0 ? "bg-green-100 border-green-500 font-medium" : "hover:bg-gray-50"}
                    `}
                    onClick={() => selectWinningTeam(0)}
                  >
                    <div className="font-medium mb-1">Team 1</div>
                    <div>
                      {selectedPlayers
                        .slice(0, 2)
                        .map((id) => getPlayerName(id))
                        .join(" & ")}
                    </div>
                  </div>
                  <div
                    className={`
                      p-4 border rounded-md cursor-pointer text-center
                      ${winningTeamIndex === 1 ? "bg-green-100 border-green-500 font-medium" : "hover:bg-gray-50"}
                    `}
                    onClick={() => selectWinningTeam(1)}
                  >
                    <div className="font-medium mb-1">Team 2</div>
                    <div>
                      {selectedPlayers
                        .slice(2, 4)
                        .map((id) => getPlayerName(id))
                        .join(" & ")}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={selectedPlayers.length !== 4 || winningTeamIndex === null}
            >
              Record Match
            </button>
          </form>
          {/* Matches List */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Team 1</th>
                  <th className="px-4 py-2 border">Team 2</th>
                  <th className="px-4 py-2 border">Winner</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match) => {
                  const team1 = match.teams[0]
                  const team2 = match.teams[1]
                  const winnerTeam = match.teams.find((team) => team.id === match.winnerTeamId)
                  return (
                    <tr key={match.id}>
                      <td className="px-4 py-2 border">{formatDate(match.date)}</td>
                      <td className="px-4 py-2 border">{team1.playerIds.map((id) => getPlayerName(id)).join(" & ")}</td>
                      <td className="px-4 py-2 border">{team2.playerIds.map((id) => getPlayerName(id)).join(" & ")}</td>
                      <td className="px-4 py-2 border font-medium">
                        {winnerTeam ? winnerTeam.playerIds.map((id) => getPlayerName(id)).join(" & ") : "Unknown"}
                      </td>
                    </tr>
                  )
                })}
                {matches.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-2 text-center">
                      No matches recorded
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Statistics Tab */}
      {activeTab === "stats" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Statistics</h2>
          {/* Player Stats */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-3">Player Statistics</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Player</th>
                    <th className="px-4 py-2 border">Matches</th>
                    <th className="px-4 py-2 border">Wins</th>
                    <th className="px-4 py-2 border">Losses</th>
                    <th className="px-4 py-2 border">Win %</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => {
                    const stats = playerStats.get(player.id)
                    return (
                      <tr key={player.id}>
                        <td className="px-4 py-2 border">{player.name}</td>
                        <td className="px-4 py-2 border">{stats?.totalMatches || 0}</td>
                        <td className="px-4 py-2 border">{stats?.wins || 0}</td>
                        <td className="px-4 py-2 border">{stats?.losses || 0}</td>
                        <td className="px-4 py-2 border">{stats ? stats.winPercentage.toFixed(1) + "%" : "0%"}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {/* Team Stats */}
          <div>
            <h3 className="text-xl font-medium mb-3">Team Statistics</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Team</th>
                    <th className="px-4 py-2 border">Matches</th>
                    <th className="px-4 py-2 border">Wins</th>
                    <th className="px-4 py-2 border">Losses</th>
                    <th className="px-4 py-2 border">Win %</th>
                    <th className="px-4 py-2 border">Win Probability</th>
                  </tr>
                </thead>
                <tbody>
                  {teamStats.map((stats) => (
                    <tr key={stats.teamId}>
                      <td className="px-4 py-2 border">{stats.playerIds.map((id) => getPlayerName(id)).join(" & ")}</td>
                      <td className="px-4 py-2 border">{stats.totalMatches}</td>
                      <td className="px-4 py-2 border">{stats.wins}</td>
                      <td className="px-4 py-2 border">{stats.losses}</td>
                      <td className="px-4 py-2 border">{stats.winPercentage.toFixed(1)}%</td>
                      <td className="px-4 py-2 border">{stats.estimatedWinProbability.toFixed(1)}%</td>
                    </tr>
                  ))}
                  {teamStats.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-2 text-center">
                        No team statistics available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}