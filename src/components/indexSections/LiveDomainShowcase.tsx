
import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Lock, ChevronLeft, ChevronRight } from 'lucide-react'
import IndexLayout from './_layout'
import SectionHeading from '../ui/SectionHeading'
import { INDEX_PATHS } from '../../routes/indexPaths'

interface DomainConfig {
    previewImage: string | null
    logoImage: string | null
    href: string
    accentFrom: string
    accentTo: string
}

interface ShowcaseItem {
    title: string
    description: string
    tags: string[]
    url: string
    logoAlt: string
    previewAlt: string
}

const DOMAINS: DomainConfig[] = [
    {
        previewImage: 'https://res.cloudinary.com/emilber-portfolio/image/upload/f_auto,q_auto,w_1200,c_limit/v1778535404/spillarena-preview_yif14p.jpg',
        logoImage: 'https://res.cloudinary.com/emilber-portfolio/image/upload/f_auto,q_auto,w_112,c_limit/v1778535404/logo_qgrwwk.png',
        href: 'https://spillarena.no',
        accentFrom: '#aa00ff',
        accentTo: '#ff2d78',
    },
    {
        previewImage: null,
        logoImage: null,
        href: 'https://tools.emilb.no',
        accentFrom: '#0070f3',
        accentTo: '#00d2ff',
    },
]

const SLIDE_MS = 380
const SLIDE_DISTANCE = 56
const SLIDE_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

// Live page screenshot via microlink — probes the actual page instead of a static image.
function screenshotSrc(href: string) {
    return `https://api.microlink.io/?url=${encodeURIComponent(href)}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=960&viewport.height=600`
}

export default function LiveDomainShowcase() {
    const { t } = useTranslation()
    const [active, setActive] = useState(0)
    const [paused, setPaused] = useState(false)
    const [phase, setPhase] = useState<'idle' | 'exiting' | 'entering'>('idle')
    const [slideDir, setSlideDir] = useState(1)
    const [failed, setFailed] = useState<Record<number, boolean>>({})
    const navigatingRef = useRef(false)

    const items = t('showcase.items', { returnObjects: true }) as ShowcaseItem[]
    const domain = DOMAINS[active]
    const item = items[active]

    // Live screenshot first; on failure fall back to the static previewImage (may be null → gradient).
    function previewSrc(d: DomainConfig, i: number): string | null {
        return failed[i] ? d.previewImage : screenshotSrc(d.href)
    }

    function handlePreviewError(i: number) {
        setFailed((prev) => (prev[i] ? prev : { ...prev, [i]: true }))
    }

    // Declared before the autoplay effect so it can be a dependency without hitting the TDZ.
    const navigate = useCallback((rawIndex: number) => {
        if (navigatingRef.current) return
        const newIndex = ((rawIndex % DOMAINS.length) + DOMAINS.length) % DOMAINS.length
        if (newIndex === active) return
        navigatingRef.current = true
        setSlideDir(rawIndex >= active ? 1 : -1)
        setPhase('exiting')
        setTimeout(() => {
            setActive(newIndex)
            setPhase('entering')
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setPhase('idle')
                    navigatingRef.current = false
                })
            })
        }, SLIDE_MS)
    }, [active])

    useEffect(() => {
        if (paused) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const interval = setInterval(() => {
            navigate(active + 1)
        }, 6000)
        return () => clearInterval(interval)
    }, [paused, active, navigate])

    return (
        <IndexLayout id={INDEX_PATHS.DOMAIN} band>
            <div
                className="relative w-full"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                <SectionHeading
                    title={t('showcase.title')}
                    lead={t('showcase.intro')}
                    aside={
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => navigate(active - 1)}
                                aria-label={t('showcase.prev')}
                                className="pebble-sm flex h-10 w-10 items-center justify-center border border-[var(--border)] p-0 text-[var(--text-muted)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text)]"
                            >
                                <ChevronLeft size={18} aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(active + 1)}
                                aria-label={t('showcase.next')}
                                className="pebble-sm flex h-10 w-10 items-center justify-center border border-[var(--border)] p-0 text-[var(--text-muted)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text)]"
                            >
                                <ChevronRight size={18} aria-hidden="true" />
                            </button>
                        </div>
                    }
                />

                <div
                    className="flex flex-col items-start gap-10 md:flex-row md:items-center md:gap-14"
                    style={{
                        opacity: phase === 'idle' ? 1 : 0,
                        transform: phase === 'exiting'
                            ? `translateX(${slideDir * -SLIDE_DISTANCE}px)`
                            : phase === 'entering'
                                ? `translateX(${slideDir * SLIDE_DISTANCE}px)`
                                : 'translateX(0px)',
                        transition: phase === 'entering'
                            ? 'none'
                            : `opacity ${SLIDE_MS}ms ${SLIDE_EASE}, transform ${SLIDE_MS}ms ${SLIDE_EASE}`,
                    }}
                >
                    {/* Left: what the site is */}
                    <div className="flex w-full flex-col gap-4 md:w-[22rem] md:flex-shrink-0">
                        {domain.logoImage ? (
                            <img
                                src={domain.logoImage}
                                alt={item.logoAlt}
                                className="pebble-sm h-14 w-14 object-contain"
                                loading="lazy"
                            />
                        ) : (
                            <div
                                className="pebble-sm flex h-14 w-14 items-center justify-center text-xl font-semibold text-[var(--on-accent)]"
                                style={{ background: domain.accentFrom }}
                            >
                                {item.title.charAt(0)}
                            </div>
                        )}

                        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                            <h3 className="m-0 text-[var(--text)]">{item.title}</h3>
                            <span className="inline-flex items-center gap-1.5 text-sm text-[var(--text-subtle)]">
                                <span
                                    className="h-1.5 w-1.5 rounded-full"
                                    style={{ background: '#5c8a55' }}
                                    aria-hidden="true"
                                />
                                {t('showcase.status')}
                            </span>
                        </div>

                        <p className="m-0 font-mono text-sm text-[var(--text-subtle)]">{item.url}</p>

                        <p className="prose-organic text-[var(--text-muted)]">{item.description}</p>

                        <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                            {item.tags.map((tag) => (
                                <span key={tag} className="text-[13px] text-[var(--text-subtle)]">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <a
                            href={domain.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pebble-sm mt-2 inline-flex w-fit items-center gap-2.5 px-6 py-3 font-semibold text-[var(--on-accent)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0.28,1)] hover:-translate-y-0.5"
                            style={{ background: domain.accentFrom }}
                        >
                            {t('showcase.visit')}
                            <ArrowRight size={18} aria-hidden="true" />
                        </a>
                    </div>

                    {/* Right: the site itself, in a plain window */}
                    <div className="min-w-0 flex-1">
                        <div
                            className="pebble w-full overflow-hidden border border-[var(--border)]"
                            style={{ background: 'var(--surface-raised)', boxShadow: 'var(--shadow-lifted)' }}
                        >
                            <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-2.5">
                                <div className="flex flex-shrink-0 gap-1.5" aria-hidden="true">
                                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--border-strong)' }} />
                                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--border-strong)' }} />
                                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--border-strong)' }} />
                                </div>
                                <div className="flex flex-1 items-center justify-center gap-2 font-mono text-xs text-[var(--text-subtle)]">
                                    <Lock size={12} aria-hidden="true" />
                                    {item.url}
                                </div>
                            </div>

                            <div style={{ background: 'var(--surface-sunken)' }}>
                                {previewSrc(domain, active) ? (
                                    <img
                                        src={previewSrc(domain, active) as string}
                                        alt={item.previewAlt}
                                        onError={() => handlePreviewError(active)}
                                        className="block aspect-[16/10] w-full object-cover object-top"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex h-64 w-full items-center justify-center font-mono text-sm text-[var(--text-subtle)]">
                                        {item.url}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Position markers: short rules, the active one filled. */}
                        <div className="mt-5 flex items-center gap-2">
                            {DOMAINS.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => navigate(i)}
                                    className="h-[3px] p-0 transition-all duration-300"
                                    style={{
                                        width: active === i ? '34px' : '14px',
                                        borderRadius: '99px',
                                        background: active === i ? 'var(--accent)' : 'var(--border-strong)',
                                    }}
                                    aria-label={t('showcase.goToSlide', { number: i + 1 })}
                                    aria-current={active === i}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </IndexLayout>
    )
}
