import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useCookieConsent } from '../hooks/useCookieConsent'
import { readPreference, writePreference } from '../lib/cookieConsent'
import { ACCENT_PRESETS, ACCENT_STORAGE_KEY, AccentContext, DEFAULT_ACCENT } from './accentContext'
import type { AccentColor } from './accentContext'

function getInitialAccent(): AccentColor {
    const stored = readPreference(ACCENT_STORAGE_KEY) as AccentColor | null
    if (stored && stored in ACCENT_PRESETS) return stored
    return DEFAULT_ACCENT
}

export function AccentProvider({ children }: { children: ReactNode }) {
    const { isDark } = useTheme()
    const { consent } = useCookieConsent()
    const [accent, setAccentState] = useState<AccentColor>(getInitialAccent)

    useEffect(() => {
        const preset = ACCENT_PRESETS[accent] ?? ACCENT_PRESETS[DEFAULT_ACCENT]
        document.documentElement.style.setProperty('--accent', isDark ? preset.dark : preset.light)
        document.documentElement.style.setProperty('--accent-text', isDark ? preset.dark : preset.lightText)

        if (consent === 'accepted') {
            writePreference(ACCENT_STORAGE_KEY, accent)
        }
    }, [accent, isDark, consent])

    const value = useMemo(
        () => ({
            accent,
            setAccent: (next: AccentColor) => setAccentState(next),
        }),
        [accent]
    )

    return <AccentContext.Provider value={value}>{children}</AccentContext.Provider>
}
