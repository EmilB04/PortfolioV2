import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { THEME_STORAGE_KEY, ThemeContext } from './themeContext'
import type { Theme } from './themeContext'

function getInitialTheme(): Theme {
    if (typeof window === 'undefined') {
        return 'dark'
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme
    }

    return 'dark'
}

function applyTheme(theme: Theme) {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
    root.style.colorScheme = theme
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(getInitialTheme)

    useEffect(() => {
        applyTheme(theme)
        window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    }, [theme])

    const value = useMemo(
        () => ({
            theme,
            isDark: theme === 'dark',
            toggleTheme: () => setThemeState((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark')),
            setTheme: (nextTheme: Theme) => setThemeState(nextTheme)
        }),
        [theme]
    )

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
