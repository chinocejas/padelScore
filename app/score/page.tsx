'use client'

import React, { useState } from 'react'
import { Container, Tabs, Tab, Box, Typography,IconButton ,Tooltip} from '@mui/material'
import PlayersTab from '../../components/PlayersTab'
import MatchesTab from '../../components/MatchesTab'
import StatisticsTab from '../../components/StatisticsTab'
import { useThemeMode } from '../../components/ThemeContext'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'

export default function ScorePage() {
    // dentro del componente ScorePage
    const { toggleTheme, mode } = useThemeMode()
    const [activeTab, setActiveTab] = useState(0)

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
        sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
        }}
        >
        <Typography variant="h4">Padel Score</Typography>
        <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
        </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      

        <Tabs value={activeTab} onChange={handleTabChange} aria-label="score tabs">
          <Tab label="Players" />
          <Tab label="Matches" />
          <Tab label="Statistics" />
        </Tabs>
      </Box>

      <Box>
        {activeTab === 0 && <PlayersTab />}
        {activeTab === 1 && <MatchesTab />}
        {activeTab === 2 && <StatisticsTab />}
      </Box>
    </Container>
  )
}
