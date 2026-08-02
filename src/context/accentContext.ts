import { createContext } from 'react'

export type AccentColor =
    | 'rose'
    | 'pink'
    | 'fuchsia'
    | 'violet'
    | 'indigo'
    | 'blue'
    | 'sky'
    | 'cyan'
    | 'teal'
    | 'emerald'
    | 'lime'
    | 'amber'
    | 'orange'

export type AccentDefinition = {
    label: string
    light: string
    /** Darker light-mode tint used for accent-colored text on the page background — the base `light`
     *  fill is tuned to stay readable under black button text, which is too pale for AA text contrast
     *  on its own (see WCAG contrast fixes). */
    lightText: string
    dark: string
}

export const ACCENT_PRESETS: Record<AccentColor, AccentDefinition> = {
    rose: { label: 'Rose', light: '#e5375d', lightText: '#d11b43', dark: '#f1376e' },
    pink: { label: 'Pink', light: '#de3b83', lightText: '#c9226c', dark: '#f472b6' },
    fuchsia: { label: 'Fuchsia', light: '#c935db', lightText: '#b223c4', dark: '#e879f9' },
    violet: { label: 'Violet', light: '#935df0', lightText: '#7c3aed', dark: '#a78bfa' },
    indigo: { label: 'Indigo', light: '#6a6df2', lightText: '#5356f0', dark: '#818cf8' },
    blue: { label: 'Blue', light: '#4177ee', lightText: '#2361eb', dark: '#60a5fa' },
    sky: { label: 'Sky', light: '#0284c7', lightText: '#0270a9', dark: '#38bdf8' },
    cyan: { label: 'Cyan', light: '#0891b2', lightText: '#067590', dark: '#22d3ee' },
    teal: { label: 'Teal', light: '#0d9488', lightText: '#0b786e', dark: '#2dd4bf' },
    emerald: { label: 'Emerald', light: '#059669', lightText: '#047b56', dark: '#34d399' },
    lime: { label: 'Lime', light: '#65a30d', lightText: '#4b780a', dark: '#a3e635' },
    amber: { label: 'Amber', light: '#d97706', lightText: '#a25904', dark: '#fbbf24' },
    orange: { label: 'Orange', light: '#ea580c', lightText: '#b9460a', dark: '#fb923c' },
}

export const DEFAULT_ACCENT: AccentColor = 'rose'
export const ACCENT_STORAGE_KEY = 'portfolio-accent'

export type AccentContextValue = {
    accent: AccentColor
    setAccent: (accent: AccentColor) => void
}

export const AccentContext = createContext<AccentContextValue | undefined>(undefined)
