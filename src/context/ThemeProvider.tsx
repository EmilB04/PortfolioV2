// ThemeProvider.tsx
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { THEME_STORAGE_KEY, ThemeContext } from './themeContext'
import type { Theme } from './themeContext'

function getInitialTheme(): Theme {
    if (typeof window === 'undefined') return 'dark'
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') return stored
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
    const [flashKey, setFlashKey] = useState(0)
    const isFirstRender = useRef(true)

    useEffect(() => {
        applyTheme(theme)
        window.localStorage.setItem(THEME_STORAGE_KEY, theme)

        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        setFlashKey((k) => k + 1)
    }, [theme])

    const value = useMemo(
        () => ({
            theme,
            isDark: theme === 'dark',
            toggleTheme: () =>
                setThemeState((curr) => (curr === 'dark' ? 'light' : 'dark')),
            setTheme: (next: Theme) => setThemeState(next),
        }),
        [theme]
    )

    const flashColor = theme === 'dark' ? '#0a0a0a' : '#ffffff'

    return (
        <ThemeContext.Provider value={value}>
            {children}
            <AnimatePresence>
                <motion.div
                    key={flashKey}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: flashColor,
                        pointerEvents: 'none',
                        zIndex: 9999,
                    }}
                />
            </AnimatePresence>
        </ThemeContext.Provider>
    )
}