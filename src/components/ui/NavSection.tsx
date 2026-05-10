import { useEffect, useState } from 'react'
import LanguageSwitcher from '../header/LanguageSwitcher'
import ThemeSwitcher from '../header/ThemeSwitcher'

const links = [
    { href: 'landing', label: 'Hjem' },
    { href: 'about', label: 'Om meg' },
    { href: 'live-projects', label: 'Prosjekter' },
    { href: 'timeline', label: 'Tidslinje' },
]

function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function NavLinkList({ activeSection, onNavigate }: { activeSection: string; onNavigate: (id: string) => void }) {
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
                        style={{
                            color: 'var(--c-text)',
                        }}
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


function MobileMenuButton({ menuOpen, onToggle }: { menuOpen: boolean; onToggle: () => void }) {
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
            aria-label={menuOpen ? 'Lukk meny' : 'Åpne meny'}
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


function MobileDrawer({ isOpen, onNavigate, onClose }: { isOpen: boolean; onNavigate: (id: string) => void; onClose: () => void }) {
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
        <>

            <div
                className={`fixed inset-y-0 right-0 z-[300] h-dvh max-h-dvh w-[min(80%,300px)] flex flex-col overflow-y-auto border-l border-[var(--c-border)] shadow-[var(--shadow)] pt-20 pb-8 transition-transform duration-300 ease-out motion-reduce:transition-none ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                style={{
                    background: 'var(--c-bg)',
                }}
            >
                <section className="mb-8 flex flex-row items-center justify-between gap-4 px-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--c-text-subtle)]">
                        Navigasjon
                    </span>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Lukk meny"
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
                        Innstillinger
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
                    Kontakt meg
                </a>
            </div>
        </>
    )
}


export default function NavSection() {
    const [activeSection, setActiveSection] = useState('')
    const [menuOpen, setMenuOpen] = useState(false)
    const [drawerMounted, setDrawerMounted] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)

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
    }, [])

    // Close menu on resize to desktop
    useEffect(() => {
        function onResize() {
            if (window.innerWidth > 710) setMenuOpen(false)
        }
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

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
                <NavLinkList activeSection={activeSection} onNavigate={navigate} />

                <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                    <MobileMenuButton menuOpen={menuOpen} onToggle={toggleMenu} />
                </div>
            </div>

            <div className="flex items-center gap-2 md:hidden">
                <MobileMenuButton menuOpen={menuOpen} onToggle={toggleMenu} />
            </div>

            {drawerMounted ? (
                <MobileDrawer isOpen={drawerOpen} onNavigate={navigate} onClose={closeMenu} />
            ) : null}
        </nav>
    )
}