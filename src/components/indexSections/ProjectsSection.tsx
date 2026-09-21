import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ExternalLink, Github } from 'lucide-react'
import IndexLayout from './_layout'
import SectionHeading from '../ui/SectionHeading'
import { TagList } from '../ui/Tag'
import { FeaturedProjectsSkeleton } from '../ui/Skeleton'
import BrowserPreview from '../BrowserPreview'
import { resolveMediaUrl } from '../../lib/media'
import { supabase } from '../../lib/supabase'
import type { Project } from '../../hooks/useProjects'
import { INDEX_PATHS } from '../../routes/indexPaths'
import { ROUTES } from '../../routes/routes'

// Change these slugs to control which projects are featured here
const FEATURED_SLUGS = ['streamdeck-battery-monitor', 'varsel', 'perceivo', 'readme-generator', 'pageprobe'] as const

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

    // Warm Microlink's screenshot cache for every live project up front — switching
    // tabs later then hits an already-rendering (or cached) screenshot instead of
    // triggering a fresh cold render.
    useEffect(() => {
        projects.forEach((p) => {
            if (!p.live_url) return
            const img = new Image()
            img.src = `https://api.microlink.io/?url=${encodeURIComponent(p.live_url)}&screenshot=true&meta=false&embed=screenshot.url`
        })
    }, [projects])

    const active = projects[activeIndex]
    const previewImage = resolveMediaUrl(active?.images?.[0])
    const hasPreview = Boolean(active?.live_url) || Boolean(previewImage)

    return (
        <IndexLayout id={INDEX_PATHS.PROJECTS}>
            <SectionHeading
                title={t('projectsSection.title')}
                lead={t('projectsSection.intro')}
                aside={
                    <Link
                        to={ROUTES.PROJECTS.path}
                        className="inline-flex items-center gap-2 text-[15px] font-medium text-[var(--accent-text)]"
                    >
                        {t('projectsSection.cta')}
                        <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                }
            />

            {loading ? (
                <FeaturedProjectsSkeleton />
            ) : (
                <div className="w-full">
                    {/* Narrow screens: the projects run along one scrollable row. */}
                    <div className="mb-5 flex gap-2 overflow-x-auto pb-1 md:hidden">
                        {projects.map((p, i) => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => setActiveIndex(i)}
                                className={`pebble-sm flex-shrink-0 px-4 py-2 text-sm font-medium transition-colors duration-200 ${i === activeIndex
                                    ? 'bg-[var(--accent-solid)] text-[var(--on-accent)]'
                                    : 'border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text)]'
                                    }`}
                            >
                                {p.title}
                            </button>
                        ))}
                    </div>

                    <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-[13rem_1fr] md:gap-10">
                        {/* Wide screens: an index down the left, marked rather than boxed. */}
                        <div className="hidden min-w-0 flex-col md:flex">
                            {projects.map((p, i) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setActiveIndex(i)}
                                    aria-current={i === activeIndex}
                                    className="group flex w-full flex-col items-start gap-1 border-l px-4 py-3 text-left transition-colors duration-200"
                                    style={{
                                        borderRadius: 0,
                                        borderColor: i === activeIndex ? 'var(--accent)' : 'var(--border)',
                                        background: 'transparent',
                                    }}
                                >
                                    <span
                                        className={`text-[15px] transition-colors ${i === activeIndex
                                            ? 'font-semibold text-[var(--text)]'
                                            : 'text-[var(--text-subtle)] group-hover:text-[var(--text)]'
                                            }`}
                                    >
                                        {p.title}
                                    </span>
                                    {p.live_url && (
                                        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-subtle)]">
                                            <span
                                                className="h-1.5 w-1.5 rounded-full"
                                                style={{ background: '#5c8a55' }}
                                                aria-hidden="true"
                                            />
                                            {t('projectCard.live')}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Detail panel */}
                        <div className="min-w-0" style={{ minHeight: '320px' }}>
                            <AnimatePresence mode="wait">
                                {active && (
                                    <motion.div
                                        key={active.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.18, ease: 'easeOut' }}
                                        className="flex flex-col gap-5"
                                    >
                                        <div className="flex flex-wrap items-baseline gap-3">
                                            <h3 className="m-0 text-[var(--text)]">{active.title}</h3>
                                            {active.live_url && (
                                                <span className="inline-flex items-center gap-1.5 text-sm text-[var(--text-subtle)]">
                                                    <span
                                                        className="h-1.5 w-1.5 rounded-full"
                                                        style={{ background: '#5c8a55' }}
                                                        aria-hidden="true"
                                                    />
                                                    {t('projectCard.live')}
                                                </span>
                                            )}
                                        </div>

                                        {/* Body — preview beside the description on wide screens */}
                                        <div className={`flex flex-col gap-6 ${hasPreview ? 'md:flex-row md:items-start md:gap-8' : ''}`}>
                                            {active.live_url ? (
                                                <div className="min-w-0 md:flex-1">
                                                    <BrowserPreview
                                                        url={active.live_url}
                                                        placeholderUrl={previewImage || undefined}
                                                    />
                                                </div>
                                            ) : previewImage ? (
                                                <div className="pebble min-w-0 overflow-hidden border border-[var(--border)] bg-[var(--surface)] md:flex-1">
                                                    <img
                                                        src={previewImage}
                                                        alt={active.title}
                                                        className="aspect-video w-full object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            ) : null}

                                            <div className={`flex flex-col gap-5 ${hasPreview ? 'md:w-64 md:flex-shrink-0' : ''}`}>
                                                <p className="prose-organic text-[15px] text-[var(--text-muted)]">
                                                    {active.description}
                                                </p>

                                                <div className="flex flex-wrap gap-2.5">
                                                    {active.live_url && (
                                                        <a
                                                            href={active.live_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="pebble-sm inline-flex items-center gap-2 bg-[var(--accent-solid)] px-4 py-2.5 text-sm font-semibold text-[var(--on-accent)] transition-transform duration-300 hover:-translate-y-0.5"
                                                        >
                                                            {t('projectsSection.visitSite')}
                                                            <ExternalLink size={14} aria-hidden="true" />
                                                        </a>
                                                    )}
                                                    <Link
                                                        to={ROUTES.PROJECT_DETAILS.path.replace(':projectId', active.local_path)}
                                                        className="pebble-sm inline-flex items-center gap-2 border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text)]"
                                                    >
                                                        {t('projectCard.readMore')}
                                                    </Link>
                                                    <a
                                                        href={active.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="pebble-sm inline-flex items-center gap-2 border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text)]"
                                                    >
                                                        {t('projectCard.sourceCode')}
                                                        <Github size={14} aria-hidden="true" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tags run the full width of the panel: in the narrow
                                            column they stacked into a tall ladder and pushed the
                                            actions out of view. */}
                                        {active.tags?.length > 0 && (
                                            <TagList tags={active.tags} className="pt-1" />
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            )}
        </IndexLayout>
    )
}
