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

/* ── WCAG 1.4.6 (enhanced/AAA, 7:1) contrast for accent-filled CTAs ──
   The 13 accent presets are user-chosen and span very different lightness
   values, so a single hard-coded on-accent text color (black) fails
   contrast on the more saturated ones. For each accent we pick whichever
   of black/white reads better, then — if that still falls short of 7:1 —
   nudge the *fill* used behind that text toward the opposite extreme
   until it clears the threshold. `--accent` itself (used for borders,
   rings, accent-colored text elsewhere) is left untouched; only
   `--accent-solid` (used for solid CTA backgrounds paired with on-accent
   text) is adjusted. */
const ON_ACCENT_DARK = '#12160f'
const ON_ACCENT_LIGHT = '#ffffff'
const TARGET_CONTRAST = 7

function hexToRgb(hex: string) {
    const c = hex.replace('#', '')
    return {
        r: parseInt(c.slice(0, 2), 16),
        g: parseInt(c.slice(2, 4), 16),
        b: parseInt(c.slice(4, 6), 16),
    }
}

function rgbToHex(r: number, g: number, b: number) {
    const c = (v: number) => Math.round(v).toString(16).padStart(2, '0')
    return `#${c(r)}${c(g)}${c(b)}`
}

function relativeLuminance(hex: string) {
    const { r, g, b } = hexToRgb(hex)
    const lin = (v: number) => {
        const s = v / 255
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function contrastRatio(hexA: string, hexB: string) {
    const la = relativeLuminance(hexA)
    const lb = relativeLuminance(hexB)
    const [hi, lo] = la > lb ? [la, lb] : [lb, la]
    return (hi + 0.05) / (lo + 0.05)
}

function mixHex(a: string, b: string, t: number) {
    const pa = hexToRgb(a)
    const pb = hexToRgb(b)
    return rgbToHex(pa.r + (pb.r - pa.r) * t, pa.g + (pb.g - pa.g) * t, pa.b + (pb.b - pa.b) * t)
}

/** Picks the higher-contrast of black/white for text on `accentHex`, and returns a
 *  (possibly lightened/darkened) fill that clears `TARGET_CONTRAST` against that text. */
function resolveOnAccent(accentHex: string): { text: string; solidFill: string } {
    const text =
        contrastRatio(accentHex, ON_ACCENT_DARK) >= contrastRatio(accentHex, ON_ACCENT_LIGHT)
            ? ON_ACCENT_DARK
            : ON_ACCENT_LIGHT

    if (contrastRatio(accentHex, text) >= TARGET_CONTRAST) {
        return { text, solidFill: accentHex }
    }

    const extreme = text === ON_ACCENT_DARK ? '#ffffff' : '#000000'
    let lo = 0
    let hi = 1
    for (let i = 0; i < 20; i++) {
        const mid = (lo + hi) / 2
        const candidate = mixHex(accentHex, extreme, mid)
        if (contrastRatio(candidate, text) >= TARGET_CONTRAST) hi = mid
        else lo = mid
    }
    return { text, solidFill: mixHex(accentHex, extreme, hi) }
}

export function AccentProvider({ children }: { children: ReactNode }) {
    const { isDark } = useTheme()
    const { consent } = useCookieConsent()
    const [accent, setAccentState] = useState<AccentColor>(getInitialAccent)

    useEffect(() => {
        const preset = ACCENT_PRESETS[accent] ?? ACCENT_PRESETS[DEFAULT_ACCENT]
        const accentHex = isDark ? preset.dark : preset.light
        const { text, solidFill } = resolveOnAccent(accentHex)

        const root = document.documentElement.style
        root.setProperty('--accent', accentHex)
        root.setProperty('--accent-text', isDark ? preset.dark : preset.lightText)
        root.setProperty('--on-accent', text)
        root.setProperty('--accent-solid', solidFill)

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
