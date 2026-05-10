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
                        className={`
                            block px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide
                            transition-all duration-200 whitespace-nowrap
                            ${activeSection === href
                                ? 'text-[var(--c-text)] bg-[rgba(255,255,255,0.1)]'
                                : 'text-[rgba(255,255,255,0.55)] bg-transparent hover:text-[var(--c-text)] hover:bg-[rgba(255,255,255,0.08)]'
                            }
                        `}
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
            className={`
                flex md:hidden flex-col items-center justify-center gap-1.25 w-9 h-9
                rounded-full border transition-all duration-200
                ${menuOpen
                    ? 'bg-[rgba(255,255,255,0.15)] border-[rgba(255,255,255,0.2)]'
                    : 'bg-[rgba(255,255,255,0.08)] border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.12)] hover:scale-[1.08]'
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


function MobileDrawer({ menuOpen, onNavigate, onClose }: { menuOpen: boolean; onNavigate: (id: string) => void; onClose: () => void }) {
    if (!menuOpen) {
        return null
    }

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[250]"
            />

            {/* Drawer */}
            <div className="
                fixed top-0 right-0 bottom-0 z-[300]
                w-[min(80%,300px)] flex flex-col
                overflow-y-auto
                bg-[rgba(15,15,20,0.97)] backdrop-blur-2xl
                border-l border-[rgba(255,255,255,0.07)]
                shadow-[-8px_0_40px_rgba(0,0,0,0.4)]
                pt-20 pb-8
            ">
                {/* Header */}
                <span className="
                    absolute top-[1.4rem] left-6
                    text-xs font-bold tracking-widest uppercase
                    text-[rgba(255,255,255,0.3)]
                ">
                    Navigasjon
                </span>

                {/* Navigation Links */}
                {links.map(({ href, label }) => (
                    <button
                        key={href}
                        onClick={() => onNavigate(href)}
                        className="
                            w-full px-6 py-4
                            border-b border-[rgba(255,255,255,0.06)]
                            text-left text-sm font-medium
                            text-[rgba(255,255,255,0.6)]
                            transition-all duration-200
                            hover:text-[var(--c-text)]
                            hover:bg-[rgba(255,255,255,0.05)]
                            hover:pl-8
                        "
                    >
                        {label}
                    </button>
                ))}

                {/* Contact Button */}
                <a
                    href="/contact"
                    onClick={onClose}
                    className="
                        mx-6 mt-4 px-4 py-3
                        rounded-full text-xs font-semibold
                        text-white
                        bg-[var(--c-accent)]
                        text-center
                        transition-all duration-200
                        hover:brightness-[1.12]
                    "
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
        <nav className="flex items-center justify-between gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-1 min-w-0">
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