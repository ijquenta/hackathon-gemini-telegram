"use client"

import * as React from "react"
import { Moon, SunMedium } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Button variant="outline" size="sm" className="opacity-0 pointer-events-none">Tema</Button>
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme
  const nextTheme = currentTheme === "dark" ? "light" : "dark"
  const isDark = currentTheme === "dark"

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(nextTheme)}
      aria-label="Cambiar tema"
      className="gap-2"
    >
      {isDark ? <SunMedium className="size-4" /> : <Moon className="size-4" />}
      {isDark ? "Claro" : "Oscuro"}
    </Button>
  )
}
