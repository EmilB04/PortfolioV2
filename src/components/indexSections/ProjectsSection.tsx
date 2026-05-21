import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ExternalLink, Github, Lock } from 'lucide-react'
import IndexLayout from './_layout'
import LoadingSpinner from '../ui/LoadingSpinner'
import { supabase } from '../../lib/supabase'
import type { Project } from '../../hooks/useProjects'
import { INDEX_PATHS } from '../../routes/indexPaths'
import { ROUTES } from '../../routes/routes'

// Change these 4 slugs to control which projects are featured here
const FEATURED_SLUGS = ['varsel', 'hangbot', 'fleetbot', 'pageprobe'] as const

export default function ProjectsSection() {
    const { t } = useTranslation()
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        let mounted = true
            ; (async () => {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .in('local_path', [...FEATURED_SLUGS])

                if (error) {
                    console.error(error)
                } else if (mounted && data) {
                    const sorted = [...FEATURED_SLUGS]
                        .map((slug) => (data as Project[]).find((p) => p.local_path === slug))
                        .filter(Boolean) as Project[]
                    setProjects(sorted)
                }
                if (mounted) setLoading(false)
            })()

        return () => {
            mounted = false
        }
    }, [])

    const active = projects[activeIndex]

    return (
        <IndexLayout id={INDEX_PATHS.PROJECTS} className="flex-col px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
            <header className="mb-10 w-full text-center">
                <h2 className="text-3xl font-semibold sm:text-4xl">{t('projectsSection.title')}</h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
                    {t('projectsSection.intro')}
                </p>
            </header>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="w-full overflow-hidden">
                    {/* Mobile: horizontal pill tabs */}
                    <div className="mb-5 flex gap-2 overflow-x-auto pb-1 sm:hidden">
                        {projects.map((p, i) => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => setActiveIndex(i)}
                                className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 ${i === activeIndex
                                    ? 'bg-[var(--accent)] text-black'
                                    : 'border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text)]'
                                    }`}
                            >
                                {p.title}
                            </button>
                        ))}
                    </div>

                    <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-[200px_1fr]">
                        {/* Desktop: vertical selector list */}
                        <div className="hidden min-w-0 flex-col gap-2 sm:flex">
                            {projects.map((p, i) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setActiveIndex(i)}
                                    className={`group flex w-full flex-col items-start rounded-xl border px-4 py-3 text-left transition-all duration-200 ${i === activeIndex
                                        ? 'border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_10%,var(--surface-card))]'
                                        : 'border-[var(--border)] bg-[var(--surface-card)] hover:border-[var(--border-hover)]'
                                        }`}
                                >
                                    <span
                                        className={`text-sm font-semibold transition-colors ${i === activeIndex
                                            ? 'text-[var(--text)]'
                                            : 'text-[var(--text-muted)] group-hover:text-[var(--text)]'
                                            }`}
                                    >
                                        {p.title}
                                    </span>
                                    {p.live_url && (
                                        <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-semibold text-green-400">
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                                            {t('projectCard.live')}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Detail panel */}
                        <div
                            className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-card)]"
                            style={{ minHeight: '320px' }}
                        >
                            <AnimatePresence mode="wait">
                                {active && (
                                    <motion.div
                                        key={active.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2, ease: 'easeOut' }}
                                        className="flex flex-col gap-5 p-6"
                                    >
                                        {/* Title + live badge */}
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="text-xl font-semibold text-[var(--text)]">
                                                {active.title}
                                            </h3>
                                            {active.live_url && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/15 px-2.5 py-1 text-[11px] font-semibold text-green-400">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                                                    {t('projectCard.live')}
                                                </span>
                                            )}
                                        </div>

                                        {/* Tags — always above the body */}
                                        {active.tags?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {active.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--text-muted)]"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Body — preview left, description + buttons right on large screens */}
                                        <div className={`flex flex-col gap-5 ${active.live_url ? 'lg:flex-row lg:items-start lg:gap-6' : ''}`}>
                                            {/* Preview — only when live_url exists */}
                                            {active.live_url && (
                                                <div className="min-w-0 lg:flex-1">
                                                    <BrowserPreview
                                                        url={active.live_url}
                                                        imageUrl={active.images?.[0]}
                                                    />
                                                </div>
                                            )}

                                            {/* Description + buttons */}
                                            <div className={`flex flex-col gap-4 ${active.live_url ? 'lg:w-52 lg:flex-shrink-0' : ''}`}>
                                                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                                                    {active.description}
                                                </p>

                                                <div className="flex flex-wrap gap-3">
                                                    <a
                                                        href={active.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                                                    >
                                                        {t('projectCard.sourceCode')}
                                                        <Github size={14} />
                                                    </a>
                                                    <Link
                                                        to={ROUTES.PROJECT_DETAILS.path.replace(':projectId', active.local_path)}
                                                        className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                                                    >
                                                        {t('projectCard.readMore')}
                                                    </Link>
                                                    {active.live_url && (
                                                        <a
                                                            href={active.live_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
                                                        >
                                                            {t('projectsSection.visitSite')}
                                                            <ExternalLink size={14} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <Link
                            to={ROUTES.PROJECTS.path}
                            className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)] px-6 py-2.5 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-black"
                        >
                            {t('projectsSection.cta')}
                            <ArrowRight size={15} />
                        </Link>
                    </div>
                </div>
            )}
        </IndexLayout>
    )
}

function BrowserPreview({ url, imageUrl }: { url: string; imageUrl?: string }) {
    const [screenshotFailed, setScreenshotFailed] = useState(false)

    const hostname = (() => {
        try { return new URL(url).hostname } catch { return url }
    })()

    const microlinkSrc = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`
    const src = imageUrl ?? (screenshotFailed ? null : microlinkSrc)
    const onImgError = () => setScreenshotFailed(true)

    return (
        <div
            className="mx-auto w-full max-w-[640px] overflow-hidden rounded-xl"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15), 0 0 0 1px var(--border)' }}
        >
            {/* Chrome bar */}
            <div className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-3 py-2">
                <div className="flex flex-shrink-0 gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                </div>
                <div className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[var(--surface-card)] px-3 py-1 text-[11px] text-[var(--text-subtle)]">
                    <Lock size={10} className="opacity-50" />
                    {hostname}
                </div>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 rounded p-1 text-[var(--text-subtle)] transition-colors hover:text-[var(--text)]"
                    aria-label="Open in new tab"
                >
                    <ExternalLink size={13} />
                </a>
            </div>

            {/* Preview */}
            <div className="aspect-video w-full overflow-hidden bg-[var(--surface)]">
                {src ? (
                    <img
                        src={src}
                        alt={`${hostname} preview`}
                        onError={onImgError}
                        className="block h-full w-full object-cover object-top"
                        loading="lazy"
                    />
                ) : (
                    <div
                        className="flex h-full w-full items-center justify-center"
                        style={{ background: 'color-mix(in srgb, var(--accent) 6%, var(--surface))' }}
                    >
                        <span className="text-xs text-[var(--text-subtle)]">{hostname}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
