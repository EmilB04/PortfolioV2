import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import BackButton from '../header/BackButton'
import LanguageSwitcher from '../header/LanguageSwitcher'
import ThemeSwitcher from '../header/ThemeSwitcher'
import { INDEX_NAV_ITEMS } from '../../routes/indexPaths'

type LinkItem = {
    href: string
    label: string
}

function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function NavLinkList({ activeSection, onNavigate, links }: { activeSection: string; onNavigate: (id: string) => void; links: LinkItem[] }) {
    return (
        <ul className="hidden md:flex items-center gap-0.5 flex-1 m-0 p-0 list-none">
            {links.map(({ href, label }) => (
                <li key={href}>
                    <a
                        href={`#${href}`}
                        onClick={(e) => {
                            e.preventDefault()
                            onNavigate(href)
                        }}
                        style={{ color: 'var(--c-text)' }}
                        className={`
                            relative block px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide
                            transition-all duration-200 whitespace-nowrap
                            ${activeSection === href
                                ? 'text-[var(--c-text)]'
                                : 'text-[var(--c-text-subtle)] hover:text-[var(--c-text)]'
                            }
                        `}
                    >
                        {label}
                        <span
                            aria-hidden="true"
                            className={`
                                pointer-events-none absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full
                                bg-[var(--c-accent)] transition-all duration-300 ease-out motion-reduce:transition-none
                                ${activeSection === href ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
                            `}
                        />
                    </a>
                </li>
            ))}
        </ul>
    )
}

function MobileMenuButton({ menuOpen, onToggle, openLabel, closeLabel }: { menuOpen: boolean; onToggle: () => void; openLabel: string; closeLabel: string }) {
    return (
        <button
            className={`
                flex md:hidden flex-col items-center justify-center gap-1.25 w-9 h-9
                rounded-full border transition-all duration-200
                ${menuOpen
                    ? 'bg-[var(--c-surface-card)] border-[var(--c-border-hover)]'
                    : 'bg-[var(--c-surface)] border-[var(--c-border)] hover:bg-[var(--c-surface-card)] hover:scale-[1.08]'
                }
            `}
            onClick={onToggle}
            aria-label={menuOpen ? closeLabel : openLabel}
        >
            {menuOpen ? (
                <span className="text-[var(--c-text)] text-lg leading-none">✕</span>
            ) : (
                <span className="flex flex-col gap-1 items-center">
                    <span className="block w-4 h-0.5 bg-[var(--c-text)] rounded-sm" />
                    <span className="block w-3 h-0.5 bg-[var(--c-text)] rounded-sm" />
                    <span className="block w-4 h-0.5 bg-[var(--c-text)] rounded-sm" />
                </span>
            )}
        </button>
    )
}

function MobileDrawer({
    isOpen,
    onNavigate,
    onClose,
    links,
    navigationLabel,
    settingsLabel,
    contactLabel,
    closeLabel,
}: {
    isOpen: boolean
    onNavigate: (id: string) => void
    onClose: () => void
    links: LinkItem[]
    navigationLabel: string
    settingsLabel: string
    contactLabel: string
    closeLabel: string
}) {
    useEffect(() => {
        if (!isOpen) {
            return
        }

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [isOpen, onClose])

    return (
        <div
            className={`fixed inset-y-0 right-0 z-[300] h-dvh max-h-dvh w-[min(80%,300px)] flex flex-col overflow-y-auto border-l border-[var(--c-border)] shadow-[var(--shadow)] pt-20 pb-8 transition-transform duration-300 ease-out motion-reduce:transition-none ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            style={{ background: 'var(--c-bg)' }}
        >
            <section className="mb-8 flex flex-row items-center justify-between gap-4 px-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--c-text-subtle)]">
                    {navigationLabel}
                </span>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label={closeLabel}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--c-border)] bg-[var(--c-surface)] text-[var(--c-text)] transition-all duration-200 hover:scale-[1.05] hover:bg-[var(--c-surface-card)]"
                >
                    <span className="text-lg leading-none">✕</span>
                </button>
            </section>

            {links.map(({ href, label }) => (
                <button
                    key={href}
                    onClick={() => onNavigate(href)}
                    className="w-full border-b border-[var(--c-border)] px-6 py-4 text-left text-sm font-medium text-[var(--c-text-subtle)] transition-all duration-200 hover:bg-[var(--c-surface-card)] hover:pl-8 hover:text-[var(--c-text)]"
                >
                    {label}
                </button>
            ))}

            <div className="mt-6 border-t border-[var(--c-border)] px-6 pt-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--c-text-subtle)]">
                    {settingsLabel}
                </p>

                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    <ThemeSwitcher />
                </div>
            </div>

            <a
                href="/contact"
                onClick={onClose}
                className="mx-6 mt-6 rounded-full bg-[var(--c-accent)] px-4 py-3 text-center text-xs font-semibold text-black transform transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.01] active:translate-y-0 active:scale-[0.99] motion-reduce:transition-none hover:text-white"
            >
                {contactLabel}
            </a>
        </div>
    )
}

export default function NavSection() {
    const location = useLocation()
    const { t } = useTranslation()
    const isHomePage = location.pathname === '/'
    const [activeSection, setActiveSection] = useState('')
    const [menuOpen, setMenuOpen] = useState(false)
    const [drawerMounted, setDrawerMounted] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)

    const links: LinkItem[] = useMemo(
        () => INDEX_NAV_ITEMS.map(({ href, labelKey }) => ({ href, label: t(labelKey) })),
        [t],
    )

    useEffect(() => {
        function onScroll() {
            for (const { href } of [...links].reverse()) {
                const el = document.getElementById(href)
                if (el && window.scrollY >= el.offsetTop - 120) {
                    setActiveSection(href)
                    return
                }
            }
            setActiveSection('')
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [links])

    useEffect(() => {
        function onResize() {
            if (window.innerWidth > 710) setMenuOpen(false)
        }
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    useEffect(() => {
        const frameId = window.requestAnimationFrame(() => {
            setMenuOpen(false)
            setDrawerOpen(false)
            setDrawerMounted(false)
        })

        return () => window.cancelAnimationFrame(frameId)
    }, [location.pathname])

    useEffect(() => {
        if (menuOpen) {
            return
        }

        const unmountTimeoutId = window.setTimeout(() => setDrawerMounted(false), 300)

        return () => {
            window.clearTimeout(unmountTimeoutId)
        }
    }, [menuOpen])

    function openMenu() {
        setDrawerMounted(true)
        setMenuOpen(true)
        window.requestAnimationFrame(() => setDrawerOpen(true))
    }

    function closeMenu() {
        setDrawerOpen(false)
        setMenuOpen(false)
    }

    function toggleMenu() {
        if (menuOpen) {
            closeMenu()
            return
        }

        openMenu()
    }

    function navigate(id: string) {
        closeMenu()
        scrollTo(id)
    }

    return (
        <nav className="flex items-center justify-between gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                {isHomePage ? (
                    <NavLinkList activeSection={activeSection} onNavigate={navigate} links={links} />
                ) : (
                    <BackButton />
                )}

                {isHomePage ? (
                    <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                        <MobileMenuButton
                            menuOpen={menuOpen}
                            onToggle={toggleMenu}
                            openLabel={t('header.openMenu')}
                            closeLabel={t('header.closeMenu')}
                        />
                    </div>
                ) : null}
            </div>

            {isHomePage ? (
                <div className="flex items-center gap-2 md:hidden">
                    <MobileMenuButton
                        menuOpen={menuOpen}
                        onToggle={toggleMenu}
                        openLabel={t('header.openMenu')}
                        closeLabel={t('header.closeMenu')}
                    />
                </div>
            ) : null}

            {isHomePage && drawerMounted ? (
                <MobileDrawer
                    isOpen={drawerOpen}
                    onNavigate={navigate}
                    onClose={closeMenu}
                    links={links}
                    navigationLabel={t('header.navigation')}
                    settingsLabel={t('header.settings')}
                    contactLabel={t('contactButton.label')}
                    closeLabel={t('header.closeMenu')}
                />
            ) : null}
        </nav>
    )
}