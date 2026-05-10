import { useEffect, useState } from 'react'

const links = [
    { href: 'about-me', label: 'Om meg' },
    { href: 'domains', label: 'Domener' },
    { href: 'timeline', label: 'Tidslinje' },
    { href: 'projects', label: 'Prosjekter og sider' },
    { href: 'knowledge', label: 'Kunnskap' },
    { href: 'github', label: 'GitHub' },
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
                        className="relative whitespace-nowrap transition-colors duration-200"
                        style={{
                            display: 'block',
                            padding: '0.45rem 0.85rem',
                            borderRadius: '999px',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            letterSpacing: '0.01em',
                            textDecoration: 'none',
                            color: activeSection === href ? '#fff' : 'rgba(255,255,255,0.55)',
                            background: activeSection === href ? 'rgba(255,255,255,0.1)' : 'transparent',
                            transition: 'color 0.2s, background 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            if (activeSection !== href) {
                                e.currentTarget.style.color = '#fff'
                                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeSection !== href) {
                                e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
                                e.currentTarget.style.background = 'transparent'
                            }
                        }}
                    >
                        {label}
                    </a>
                </li>
            ))}
        </ul>
    )
}

function MobileMenuButton({ menuOpen, onToggle }: { menuOpen: boolean; onToggle: () => void }) {
    return (
        <button
            className="flex md:hidden"
            onClick={onToggle}
            aria-label={menuOpen ? 'Lukk meny' : 'Åpne meny'}
            style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '5px',
                width: 36,
                height: 36,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'background 0.2s, transform 0.2s',
                padding: 0,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                e.currentTarget.style.transform = 'scale(1.08)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.transform = ''
            }}
        >
            {menuOpen ? (
                <span style={{ color: '#fff', fontSize: '1rem', lineHeight: 1 }}>✕</span>
            ) : (
                <span style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center' }}>
                    <span style={{ display: 'block', width: 16, height: 2, background: '#fff', borderRadius: 2 }} />
                    <span style={{ display: 'block', width: 12, height: 2, background: '#fff', borderRadius: 2 }} />
                    <span style={{ display: 'block', width: 16, height: 2, background: '#fff', borderRadius: 2 }} />
                </span>
            )}
        </button>
    )
}

function MobileDrawer({ menuOpen, onNavigate, onClose }: { menuOpen: boolean; onNavigate: (id: string) => void; onClose: () => void }) {
    if (!menuOpen) {
        return null
    }

    return (
        <>
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(3px)',
                    WebkitBackdropFilter: 'blur(3px)',
                    zIndex: 250,
                }}
            />

            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: 'min(80%, 300px)',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 300,
                    overflowY: 'auto',
                    background: 'rgba(15,15,20,0.97)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderLeft: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '-8px 0 40px rgba(0,0,0,0.4)',
                    paddingTop: '5rem',
                    paddingBottom: '2rem',
                }}
            >
                <span
                    style={{
                        position: 'absolute',
                        top: '1.4rem',
                        left: '1.5rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.3)',
                    }}
                >
                    Navigasjon
                </span>

                {links.map(({ href, label }) => (
                    <button
                        key={href}
                        onClick={() => onNavigate(href)}
                        style={{
                            background: 'none',
                            border: 'none',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '1rem',
                            fontWeight: 500,
                            padding: '1rem 1.5rem',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'color 0.2s, background 0.2s, padding-left 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#fff'
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                            e.currentTarget.style.paddingLeft = '2rem'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                            e.currentTarget.style.background = 'none'
                            e.currentTarget.style.paddingLeft = '1.5rem'
                        }}
                    >
                        {label}
                    </button>
                ))}

                <a
                    href="/contact"
                    onClick={onClose}
                    style={{
                        margin: '1rem 1.5rem 0',
                        background: 'var(--c-accent)',
                        color: '#fff',
                        borderRadius: '999px',
                        padding: '0.75rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        textAlign: 'center',
                        textDecoration: 'none',
                        transition: 'filter 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.12)')}
                    onMouseLeave={(e) => (e.currentTarget.style.filter = '')}
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

    function navigate(id: string) {
        setMenuOpen(false)
        scrollTo(id)
    }

    return (
        <nav
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                flex: 1,
                minWidth: 0,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    flex: 1,
                    minWidth: 0,
                }}
            >
                <NavLinkList activeSection={activeSection} onNavigate={navigate} />

                <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                    <MobileMenuButton menuOpen={menuOpen} onToggle={() => setMenuOpen((current) => !current)} />
                </div>
            </div>

            <div className="flex items-center gap-2 sm:hidden">
                <MobileMenuButton menuOpen={menuOpen} onToggle={() => setMenuOpen((current) => !current)} />
            </div>

            <MobileDrawer menuOpen={menuOpen} onNavigate={navigate} onClose={() => setMenuOpen(false)} />
        </nav>
    )
}