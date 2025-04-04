import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from "../components/theme-provider"

export const metadata: Metadata = {
  title: 'Padel Score',
  description: 'Padel score system',
  generator: 'v0.dev',
  icons: {
    icon: "/icons8-tennis-ball-16.png",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
      </body>
    </html>
  )
}
