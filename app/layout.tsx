import type { Metadata } from 'next'
import './globals.css'
//import { ThemeProvider } from "../components/theme-provider"
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../app/theme';
import CustomThemeProvider from '../components/ThemeContext'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

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
        <AppRouterCacheProvider> 
            <CustomThemeProvider >
              {children}
+           </CustomThemeProvider>
        </AppRouterCacheProvider>
          
      </body>
    </html>
  )
}
