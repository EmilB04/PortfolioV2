import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import BackButton from '../header/BackButton'
import { SettingsPanel } from '../header/SettingsMenu'
import { INDEX_NAV_ITEMS } from '../../routes/indexPaths'
import { useFocusTrap } from '../../hooks/useFocusTrap'

type LinkItem = {
    href: string
    label: string
}

function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function NavLinkList({
    activeSection,
    onNavigate,
    links,
    settled,
}: {
    activeSection: string
    onNavigate: (id: string) => void
    links: LinkItem[]
    settled: boolean
}) {
    return (
        <ul
            className={`nav-island m-0 hidden h-11 list-none gap-0.5 px-1.5 md:flex ${settled ? 'nav-island--settled' : ''}`}
        >
            {links.map(({ href, label }) => (
                <li key={href} className="h-full py-1">
                    <a
                        href={`#${href}`}
                        aria-current={activeSection === href}
                        onClick={(e) => {
                            e.preventDefault()
                            onNavigate(href)
                        }}
                        className="nav-link"
                    >
                        {label}
                    </a>
                </li>
            ))}
        </ul>
    )
}

function MobileMenuButton({
    menuOpen,
    onToggle,
    openLabel,
    closeLabel,
    settled,
}: {
    menuOpen: boolean
    onToggle: () => void
    openLabel: string
    closeLabel: string
    settled: boolean
}) {
    return (
        <button
            className={`nav-island flex h-11 w-11 items-center justify-center p-0 md:hidden ${settled || menuOpen ? 'nav-island--settled' : ''}`}
            onClick={onToggle}
            aria-label={menuOpen ? closeLabel : openLabel}
        >
            {menuOpen ? (
                <span className="text-lg leading-none text-[var(--text)]">✕</span>
            ) : (
                <span className="flex flex-col items-center gap-1">
                    <span className="block h-0.5 w-4 rounded-sm bg-[var(--text)]" />
                    <span className="block h-0.5 w-3 rounded-sm bg-[var(--text)]" />
                    <span className="block h-0.5 w-4 rounded-sm bg-[var(--text)]" />
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
    showNavLinks,
    navigationLabel,
    settingsLabel,
    contactLabel,
    closeLabel,
}: {
    isOpen: boolean
    onNavigate: (id: string) => void
    onClose: () => void
    links: LinkItem[]
    showNavLinks: boolean
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

    const drawerRef = useRef<HTMLDivElement>(null)
    useFocusTrap(isOpen, drawerRef)

    return (
        <>
            <div
                aria-hidden="true"
                onClick={onClose}
                className={`fixed inset-0 z-[290] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out motion-reduce:transition-none ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            />

            <div
                ref={drawerRef}
                role="dialog"
                aria-modal="true"
                aria-label={navigationLabel}
                className={`fixed inset-y-0 right-0 z-[300] h-dvh max-h-dvh w-[min(85%,320px)] flex flex-col overflow-y-auto rounded-l-[32px] border-l border-[var(--border)] shadow-[var(--shadow-lifted)] pt-4 pb-8 transition-transform duration-300 ease-out motion-reduce:transition-none ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ background: 'var(--bg)' }}
            >
                <section className="mb-6 flex flex-row items-center justify-between gap-4 px-6">
                    <span className="text-sm text-[var(--text-subtle)]">{navigationLabel}</span>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={closeLabel}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] p-0 text-[var(--text)] transition-colors duration-200 hover:bg-[var(--surface-card)]"
                    >
                        <span className="text-lg leading-none">✕</span>
                    </button>
                </section>

                {showNavLinks && (
                    <nav className="mb-2 flex flex-col">
                        {links.map(({ href, label }) => (
                            <button
                                key={href}
                                onClick={() => onNavigate(href)}
                                className="w-full rounded-none border-b border-[var(--border)] px-6 py-4 text-left text-[15px] font-medium text-[var(--text-subtle)] transition-all duration-200 hover:bg-[var(--surface-card)] hover:pl-8 hover:text-[var(--text)]"
                            >
                                {label}
                            </button>
                        ))}
                    </nav>
                )}

                <div className="mt-4 border-t border-[var(--border)] px-6 pt-5">
                    <p className="mb-3 text-sm text-[var(--text-subtle)]">{settingsLabel}</p>

                    <SettingsPanel />
                </div>

                <a
                    href="/contact"
                    onClick={onClose}
                    className="mx-6 mt-6 rounded-full bg-[var(--accent)] px-4 py-3 text-center text-sm font-semibold text-[var(--on-accent)] transition-transform duration-300 ease-out hover:-translate-y-0.5 motion-reduce:transition-none"
                >
                    {contactLabel}
                </a>
            </div>
        </>
    )
}

export default function NavSection({ settled = false }: { settled?: boolean }) {
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
            if (window.innerWidth >= 1024) setMenuOpen(false)
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

    useEffect(() => {
        if (!menuOpen) {
            return
        }

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = previousOverflow
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
        <nav className="flex min-w-0 items-center justify-end gap-2.5">
            <div className="flex min-w-0 items-center gap-3">
                {isHomePage ? (
                    <NavLinkList
                        activeSection={activeSection}
                        onNavigate={navigate}
                        links={links}
                        settled={settled}
                    />
                ) : (
                    <BackButton settled={settled} />
                )}

            </div>

            <div className="flex items-center gap-2 md:hidden">
                <MobileMenuButton
                    menuOpen={menuOpen}
                    onToggle={toggleMenu}
                    openLabel={t('header.openMenu')}
                    closeLabel={t('header.closeMenu')}
                    settled={settled}
                />
            </div>

            {drawerMounted ? createPortal(
                <MobileDrawer
                    isOpen={drawerOpen}
                    onNavigate={navigate}
                    onClose={closeMenu}
                    links={links}
                    showNavLinks={isHomePage}
                    navigationLabel={t('header.navigation')}
                    settingsLabel={t('header.settings')}
                    contactLabel={t('contactButton.label')}
                    closeLabel={t('header.closeMenu')}
                />,
                document.body,
            ) : null}
        </nav>
    )
}