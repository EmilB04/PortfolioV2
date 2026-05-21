import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ExternalLink, GitFork, Star } from 'lucide-react'
import IndexLayout from './_layout'
import LoadingSpinner from '../ui/LoadingSpinner'
import { INDEX_PATHS } from '../../routes/indexPaths'

const GITHUB_USER = 'EmilB04'
const BLACKLIST = new Set(['EmilB04', 'Kommunikasjonsdesign'])
const MAX_REPOS = 8

type Repo = {
    id: number
    name: string
    description: string | null
    html_url: string
    stargazers_count: number
    forks_count: number
    language: string | null
    updated_at: string
}

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export default function GitHub() {
    const { t } = useTranslation()
    const [repos, setRepos] = useState<Repo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        let mounted = true
        ;(async () => {
            try {
                const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`)
                if (!res.ok) throw new Error()
                const data: Repo[] = await res.json()
                const filtered = data
                    .filter((r) => !BLACKLIST.has(r.name))
                    .sort((a, b) => {
                        if (b.stargazers_count !== a.stargazers_count) return b.stargazers_count - a.stargazers_count
                        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                    })
                    .slice(0, MAX_REPOS)
                if (mounted) setRepos(filtered)
            } catch {
                if (mounted) setError(true)
            } finally {
                if (mounted) setLoading(false)
            }
        })()
        return () => { mounted = false }
    }, [])

    return (
        <IndexLayout id={INDEX_PATHS.GITHUB} className="flex-col">
            <header className="mb-10 w-full text-center">
                <h2 className="text-3xl font-semibold text-[var(--accent)] sm:text-4xl">{t('github.title')}</h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
                    {t('github.intro')}
                </p>
            </header>

            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <p className="text-sm text-[var(--text-muted)]">{t('github.loading')}</p>
            ) : (
                <motion.ul
                    className="grid w-full list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                >
                    {repos.map((repo) => (
                        <motion.li key={repo.id} variants={cardVariants} className="h-full">
                            <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex h-full cursor-pointer flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-card)] p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-[color:color-mix(in_srgb,var(--accent)_30%,transparent)] hover:[box-shadow:0_8px_24px_color-mix(in_srgb,var(--accent)_15%,transparent)]"
                            >
                                {/* Header: name + stats */}
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="flex-1 break-words text-base font-semibold leading-snug text-[var(--text)] transition-colors group-hover:text-[var(--accent)]">
                                        {repo.name}
                                    </h3>
                                    <div className="flex shrink-0 items-center gap-3 text-sm text-[var(--text-subtle)]">
                                        {repo.stargazers_count > 0 && (
                                            <span className="flex items-center gap-1 text-[var(--accent)]">
                                                <Star size={13} />
                                                {repo.stargazers_count}
                                            </span>
                                        )}
                                        {repo.forks_count > 0 && (
                                            <span className="flex items-center gap-1 text-[var(--accent)]">
                                                <GitFork size={13} />
                                                {repo.forks_count}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
                                    {repo.description ?? t('github.noDescription')}
                                </p>

                                {/* Footer: language pill + link */}
                                <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
                                    {repo.language ? (
                                        <span className="rounded-full bg-[color:color-mix(in_srgb,var(--accent)_10%,transparent)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--accent)]">
                                            {repo.language}
                                        </span>
                                    ) : (
                                        <span />
                                    )}
                                    <span className="flex items-center gap-1 text-[11px] font-medium text-[var(--accent)] transition-[gap] duration-200 group-hover:gap-2">
                                        {t('github.viewRepo')}
                                        <ExternalLink size={11} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                                    </span>
                                </div>
                            </a>
                        </motion.li>
                    ))}
                </motion.ul>
            )}

            <div className="mt-10 flex justify-center">
                <a
                    href={`https://github.com/${GITHUB_USER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
                >
                    {t('github.visitProfile')}
                    <ExternalLink size={14} />
                </a>
            </div>
        </IndexLayout>
    )
}
