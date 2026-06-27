import { Moon, Monitor, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

const INDICATOR_BG: Record<string, string> = {
    dark: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.5))',
    system: 'linear-gradient(135deg, rgba(156,163,175,0.3), rgba(107,114,128,0.4))',
    light: 'linear-gradient(135deg, rgba(251,191,36,0.4), rgba(249,115,22,0.45))',
}

const INDICATOR_TRANSLATE: Record<string, string> = {
    dark: 'translateX(4px)',
    system: 'translateX(calc(100% + 4px))',
    light: 'translateX(calc(200% + 4px))',
}

const SLOTS = [
    { value: 'dark' as const, label: 'Dark', Icon: Moon, activeColor: '#a5b4fc' },
    { value: 'system' as const, label: 'System', Icon: Monitor, activeColor: 'var(--text)' },
    { value: 'light' as const, label: 'Light', Icon: Sun, activeColor: '#fbbf24' },
]

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme()

    return (
        <div
            role="group"
            aria-label="Theme"
            className="relative inline-grid grid-cols-3 rounded-full p-1 shrink-0"
            style={{
                width: 120,
                height: 40,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                backdropFilter: 'blur(12px)',
            }}
        >
            <span
                className="absolute inset-y-1 rounded-full transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none"
                style={{
                    zIndex: 0,
                    width: 'calc(33.333% - 3px)',
                    transform: INDICATOR_TRANSLATE[theme],
                    background: INDICATOR_BG[theme],
                }}
            />
            {SLOTS.map(({ value, label, Icon, activeColor }) => (
                <button
                    key={value}
                    type="button"
                    aria-label={label}
                    aria-pressed={theme === value}
                    onClick={() => setTheme(value)}
                    className="relative flex h-full w-full items-center justify-center p-0 cursor-pointer transition-colors duration-200"
                    style={{
                        zIndex: 1,
                        color: theme === value ? activeColor : 'var(--text-subtle)',
                    }}
                >
                    <Icon size={15} />
                </button>
            ))}
        </div>
    )
}
