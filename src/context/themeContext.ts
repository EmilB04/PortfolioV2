import { createContext } from 'react'

export type Theme = 'dark' | 'light' | 'system'

export type ThemeContextValue = {
    theme: Theme
    isDark: boolean
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
}

export const THEME_STORAGE_KEY = 'portfolio-theme'

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
