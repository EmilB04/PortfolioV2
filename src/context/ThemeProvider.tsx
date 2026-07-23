import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { THEME_STORAGE_KEY, ThemeContext } from './themeContext'
import type { Theme } from './themeContext'

function getSystemPreference(): 'dark' | 'light' {
    if (typeof window === 'undefined') return 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialTheme(): Theme {
    if (typeof window === 'undefined') return 'system'
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'dark' || stored === 'light' || stored === 'system') return stored
    return 'system'
}

function applyTheme(resolved: 'dark' | 'light') {
    const root = document.documentElement
    root.classList.toggle('dark', resolved === 'dark')
    root.classList.toggle('light', resolved === 'light')
    root.style.colorScheme = resolved
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(getInitialTheme)
    const [systemPref, setSystemPref] = useState<'dark' | 'light'>(getSystemPreference)
    const [flashKey, setFlashKey] = useState(0)
    const isFirstRender = useRef(true)

    const resolved = theme === 'system' ? systemPref : theme

    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = (e: MediaQueryListEvent) => {
            setSystemPref(e.matches ? 'dark' : 'light')
        }
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])

    useEffect(() => {
        applyTheme(resolved)
        window.localStorage.setItem(THEME_STORAGE_KEY, theme)

        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        setFlashKey((k) => k + 1)
    }, [resolved, theme])

    const value = useMemo(
        () => ({
            theme,
            isDark: resolved === 'dark',
            toggleTheme: () =>
                setThemeState((curr) => {
                    const effective = curr === 'system' ? systemPref : curr
                    return effective === 'dark' ? 'light' : 'dark'
                }),
            setTheme: (next: Theme) => setThemeState(next),
        }),
        [theme, resolved, systemPref]
    )

    const flashColor = resolved === 'dark' ? '#0a0a0a' : '#ffffff'

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
