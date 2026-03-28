"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="w-8 h-8 opacity-0" />
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-full border border-border bg-card shadow-sm">
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-full transition-colors ${
          theme === "light" ? "bg-muted text-foreground ring-1 ring-border" : "text-muted-foreground hover:text-foreground"
        }`}
        title="Light Mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-1.5 rounded-full transition-colors ${
          theme === "system" ? "bg-muted text-foreground ring-1 ring-border" : "text-muted-foreground hover:text-foreground"
        }`}
        title="System Preference"
      >
        <Monitor className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded-full transition-colors ${
          theme === "dark" ? "bg-muted text-foreground ring-1 ring-border" : "text-muted-foreground hover:text-foreground"
        }`}
        title="Dark Mode"
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  )
}
