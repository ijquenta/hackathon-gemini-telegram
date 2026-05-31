"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface ThemeProviderProps {
  children: React.ReactNode
  forcedTheme?: string
}

export function ThemeProvider({ children, forcedTheme }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" forcedTheme={forcedTheme} disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  )
}
