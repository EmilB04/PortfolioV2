import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { FiCheck, FiChevronDown, FiGlobe } from 'react-icons/fi'
import { SUPPORTED_LANGUAGES } from '../../lib/i18n.ts'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useLanguage } from '../../hooks/useLanguage'
import type { LanguageCode } from '../../hooks/useLanguage'

function capitalize(value: string, locale: string) {
    return value.charAt(0).toLocaleUpperCase(locale) + value.slice(1)
}

/** Each language's name in the language the page is currently shown in,
 *  e.g. "Deutsch" reads "German" on the English site and "Tysk" on the Norwegian one. */
function useLocalizedNames(uiLanguage: string) {
    return useMemo(() => {
        const names: Partial<Record<LanguageCode, string>> = {}
        try {
            const display = new Intl.DisplayNames([uiLanguage], { type: 'language' })
            for (const { code } of SUPPORTED_LANGUAGES) {
                const name = display.of(code)
                if (name) names[code] = capitalize(name, uiLanguage)
            }
        } catch {
            // Intl.DisplayNames missing: rows fall back to the native name alone.
        }
        return names
    }, [uiLanguage])
}

/** The list of languages, shared by the header popover and the mobile drawer.
 *  Arrow keys, Home and End move between options; Enter or Space picks one. */
export function LanguageOptions({ onSelected }: { onSelected?: () => void }) {
    const { t } = useTranslation()
    const { current, select } = useLanguage()
    const localizedNames = useLocalizedNames(current)
    const listRef = useRef<HTMLDivElement | null>(null)

    function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
        const options = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])
        const index = options.indexOf(document.activeElement as HTMLElement)
        let next: number | null = null

        if (event.key === 'ArrowDown') next = (index + 1) % options.length
        else if (event.key === 'ArrowUp') next = (index - 1 + options.length) % options.length
        else if (event.key === 'Home') next = 0
        else if (event.key === 'End') next = options.length - 1

        if (next !== null) {
            event.preventDefault()
            options[next]?.focus()
        }
    }

    async function handleSelect(code: LanguageCode) {
        await select(code)
        onSelected?.()
    }

    return (
        <div
            ref={listRef}
            role="listbox"
            aria-label={t('languageSwitcher.choose')}
            onKeyDown={handleKeyDown}
            className="flex flex-col gap-1"
        >
            {SUPPORTED_LANGUAGES.map(({ code, label }) => {
                const selected = code === current
                const localized = localizedNames[code]
                const showLocalized = localized && localized.toLocaleLowerCase() !== label.toLocaleLowerCase()

                return (
                    <button
                        key={code}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => void handleSelect(code)}
                        className={`
                            pebble-sm group flex min-h-[3.25rem] w-full items-center gap-3 px-2.5 py-2 text-left
                            transition-all duration-200 ease-out motion-reduce:transition-none
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]
                            ${selected
                                ? 'bg-[color:color-mix(in_srgb,var(--accent)_16%,var(--surface-card))] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_30%,transparent)]'
                                : 'hover:bg-[var(--surface)] active:scale-[0.99]'
                            }
                        `}
                    >
                        <span
                            aria-hidden="true"
                            className={`
                                pebble-sm flex h-8 w-9 shrink-0 items-center justify-center
                                font-mono text-[11px] font-semibold uppercase tracking-wider
                                transition-colors duration-200
                                ${selected
                                    ? 'bg-[var(--accent-solid)] text-[var(--on-accent)]'
                                    : 'bg-[var(--surface-sunken)] text-[var(--text-subtle)] group-hover:text-[var(--text)]'
                                }
                            `}
                        >
                            {code}
                        </span>

                        <span className="flex min-w-0 flex-1 flex-col">
                            <span
                                lang={code}
                                className={`truncate text-sm font-medium ${selected ? 'text-[var(--text)]' : 'text-[var(--text-subtle)] group-hover:text-[var(--text)]'}`}
                            >
                                {label}
                            </span>
                            {showLocalized && (
                                <span className="truncate text-xs text-[var(--text-subtle)]">{localized}</span>
                            )}
                        </span>

                        {selected && (
                            <FiCheck aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                        )}
                    </button>
                )
            })}
        </div>
    )
}

/** Collapsible language row for the mobile drawer: shows the current language,
 *  expands inline to the full list so the drawer stays short. */
export function LanguageDisclosure() {
    const { t } = useTranslation()
    const { current } = useLanguage()
    const [expanded, setExpanded] = useState(false)
    const panelId = useId()
    const currentLabel = SUPPORTED_LANGUAGES.find((language) => language.code === current)?.label

    return (
        <div>
            <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setExpanded((value) => !value)}
                className="pebble-sm flex w-full items-center gap-3 border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-left transition-colors duration-200 hover:bg-[var(--surface-card)]"
            >
                <FiGlobe aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--text-subtle)]" />
                <span className="flex-1 text-sm font-medium text-[var(--text)]">{t('languageSwitcher.section')}</span>
                <span lang={current} className="text-sm text-[var(--text-subtle)]">{currentLabel}</span>
                <FiChevronDown
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 text-[var(--text-subtle)] transition-transform duration-200 motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`}
                />
            </button>

            <div
                id={panelId}
                hidden={!expanded}
                className="pt-2"
            >
                <LanguageOptions onSelected={() => setExpanded(false)} />
            </div>
        </div>
    )
}

export default function LanguageMenu({ settled = false }: { settled?: boolean }) {
    const { t } = useTranslation()
    const { current } = useLanguage()
    const [open, setOpen] = useState(false)
    const rootRef = useRef<HTMLDivElement | null>(null)
    const panelRef = useRef<HTMLDivElement | null>(null)
    useFocusTrap(open, panelRef)

    // Declared after the trap so it runs after it: start on the active language, not the first row.
    useEffect(() => {
        if (open) panelRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus()
    }, [open])

    const currentLabel = SUPPORTED_LANGUAGES.find((language) => language.code === current)?.label

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    return (
        <div ref={rootRef} className="relative inline-flex">
            <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-label={`${t('languageSwitcher.choose')} (${currentLabel})`}
                onClick={() => setOpen((value) => !value)}
                className={`
                    nav-island group relative inline-flex h-11 items-center justify-center gap-1.5 px-3.5
                    transition-all duration-500 ease-out motion-reduce:transition-none
                    ${open
                        ? 'nav-island--settled !border-[var(--accent-border)] text-[var(--text)]'
                        : `text-[var(--text)] hover:-translate-y-[1px] ${settled ? 'nav-island--settled' : ''}`
                    }
                `}
            >
                <FiGlobe
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 transition-colors duration-300 ${open ? 'text-[var(--accent-text)]' : 'text-[var(--text-subtle)] group-hover:text-[var(--text)]'}`}
                />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider">{current}</span>
                <FiChevronDown
                    aria-hidden="true"
                    className={`h-3.5 w-3.5 shrink-0 text-[var(--text-subtle)] transition-transform duration-300 ease-out motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
                />
            </button>

            <div
                ref={panelRef}
                role="dialog"
                inert={!open}
                aria-label={t('languageSwitcher.section')}
                className={`
                    absolute right-0 top-[calc(100%+0.6rem)] z-[400] w-64 max-w-[calc(100vw-2rem)]
                    max-h-[70vh] overflow-y-auto border border-[var(--border)]
                    bg-[var(--bg)] [border-radius:var(--pebble-c)]
                    shadow-[var(--shadow-lifted)]
                    transition-all duration-200 ease-out origin-top-right motion-reduce:transition-none
                    ${open
                        ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                        : 'pointer-events-none -translate-y-1 scale-[0.98] opacity-0'
                    }
                `}
            >
                <div className="p-2">
                    <h3 className="px-2.5 pb-2 pt-1.5 text-sm font-medium text-[var(--text-subtle)]">
                        {t('languageSwitcher.section')}
                    </h3>
                    <LanguageOptions onSelected={() => setOpen(false)} />
                </div>
            </div>
        </div>
    )
}
