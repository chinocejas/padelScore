'use client'

import React, { createContext, useContext, useMemo, useState } from 'react'
import { ThemeProvider, createTheme, CssBaseline, PaletteMode } from '@mui/material'

interface ThemeContextType {
  toggleTheme: () => void
  mode: PaletteMode
}

const ThemeContext = createContext<ThemeContextType>({
  toggleTheme: () => {},
  mode: 'light',
})

export const useThemeMode = () => useContext(ThemeContext)

export default function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>('light')

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#0D47A1', // azul oscuro
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#AED581', // verde lima
            contrastText: '#1b1b1b',
          },
          background: {
            default: mode === 'light' ? '#f4f6f8' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
          text: {
            primary: mode === 'light' ? '#212121' : '#eeeeee',
            secondary: mode === 'light' ? '#555555' : '#aaaaaa',
          },
        },
        typography: {
          fontFamily: `'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
          h1: { fontSize: '2.5rem', fontWeight: 700 },
          h2: { fontSize: '2rem', fontWeight: 600 },
          h5: { fontWeight: 500 },
        },
        shape: {
          borderRadius: 10,
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: mode === 'light' ? '0 1px 4px rgba(0,0,0,0.1)' : '0 1px 4px rgba(0,0,0,0.5)',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
              },
            },
          },
          MuiTableHead: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' ? '#e0e0e0' : '#333',
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              head: {
                fontWeight: 600,
                color: mode === 'light' ? '#212121' : '#fafafa',
              },
            },
          },
        },
      }),
    [mode]
  )

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
