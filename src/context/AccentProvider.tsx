import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useTheme } from '../hooks/useTheme'
import { ACCENT_PRESETS, ACCENT_STORAGE_KEY, AccentContext, DEFAULT_ACCENT } from './accentContext'
import type { AccentColor } from './accentContext'

function getInitialAccent(): AccentColor {
    if (typeof window === 'undefined') return DEFAULT_ACCENT
    const stored = window.localStorage.getItem(ACCENT_STORAGE_KEY) as AccentColor | null
    if (stored && stored in ACCENT_PRESETS) return stored
    return DEFAULT_ACCENT
}

export function AccentProvider({ children }: { children: ReactNode }) {
    const { isDark } = useTheme()
    const [accent, setAccentState] = useState<AccentColor>(getInitialAccent)

    useEffect(() => {
        const preset = ACCENT_PRESETS[accent] ?? ACCENT_PRESETS[DEFAULT_ACCENT]
        document.documentElement.style.setProperty('--accent', isDark ? preset.dark : preset.light)
        window.localStorage.setItem(ACCENT_STORAGE_KEY, accent)
    }, [accent, isDark])

    const value = useMemo(
        () => ({
            accent,
            setAccent: (next: AccentColor) => setAccentState(next),
        }),
        [accent]
    )

    return <AccentContext.Provider value={value}>{children}</AccentContext.Provider>
}
