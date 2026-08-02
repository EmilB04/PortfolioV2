import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { AlertTriangle, ExternalLink, FolderGit2, GitCommitHorizontal, GitFork, MapPin, Star, Users } from 'lucide-react'
import IndexLayout from './_layout'
import { CommitActivitySkeleton, GitHubProfileSkeleton, RepoCardSkeleton } from '../ui/Skeleton'
import { INDEX_PATHS } from '../../routes/indexPaths'

const GITHUB_USER = 'EmilB04'
const BLACKLIST = new Set(['EmilB04', 'Kommunikasjonsdesign'])
const MAX_REPOS = 8
const MAX_ACTIVITY = 5
const RELATIVE_TIME_LOCALES: Record<string, string> = { no: 'nb' }
const CACHE_KEY = `github-section:${GITHUB_USER}`
const CACHE_TTL_MS = 10 * 60_000
const BLOCK_KEY = `github-section:${GITHUB_USER}:blocked-until`
const DEFAULT_BLOCK_MS = 10 * 60_000

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

type GitHubProfile = {
    login: string
    name: string | null
    bio: string | null
    avatar_url: string
    html_url: string
    followers: number
    public_repos: number
    location: string | null
}

type GitHubEvent = {
    id: string
    type: string
    created_at: string
    repo: { name: string }
    payload: { head?: string }
}

type CommitActivity = {
    id: string
    repo: string
    sha: string
    message: string | null
    date: string
}

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

function formatRelativeTime(dateStr: string, locale: string) {
    const rtf = new Intl.RelativeTimeFormat(RELATIVE_TIME_LOCALES[locale] ?? locale, { numeric: 'auto' })
    const diffMs = new Date(dateStr).getTime() - Date.now()
    const minutes = Math.round(diffMs / 60_000)

    if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute')
    const hours = Math.round(minutes / 60)
    if (Math.abs(hours) < 24) return rtf.format(hours, 'hour')
    const days = Math.round(hours / 24)
    if (Math.abs(days) < 30) return rtf.format(days, 'day')
    const months = Math.round(days / 30)
    if (Math.abs(months) < 12) return rtf.format(months, 'month')
    return rtf.format(Math.round(months / 12), 'year')
}

function extractPushEvents(events: GitHubEvent[]): CommitActivity[] {
    const pushes: CommitActivity[] = []

    for (const event of events) {
        if (event.type !== 'PushEvent' || !event.payload.head) continue
        pushes.push({ id: event.id, repo: event.repo.name, sha: event.payload.head, message: null, date: event.created_at })
        if (pushes.length >= MAX_ACTIVITY) break
    }

    return pushes
}

type CachedGitHubData = {
    profile: GitHubProfile | null
    repos: Repo[]
    activity: CommitActivity[]
    cachedAt: number
}

function readCache(): CachedGitHubData | null {
    try {
        const raw = sessionStorage.getItem(CACHE_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw) as CachedGitHubData
        if (Date.now() - parsed.cachedAt > CACHE_TTL_MS) return null
        return parsed
    } catch {
        return null
    }
}

function writeCache(data: Omit<CachedGitHubData, 'cachedAt'>) {
    try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, cachedAt: Date.now() }))
    } catch {
        // sessionStorage unavailable (private browsing, quota) — skip caching
    }
}

function isBlocked(): boolean {
    try {
        const until = Number(sessionStorage.getItem(BLOCK_KEY))
        return Number.isFinite(until) && until > Date.now()
    } catch {
        return false
    }
}

function recordBlock(responses: Response[]) {
    const resetHeader = responses.find((r) => r.status === 403)?.headers.get('X-RateLimit-Reset')
    const resetMs = resetHeader ? Number(resetHeader) * 1000 : NaN
    const until = Number.isFinite(resetMs) && resetMs > Date.now() ? resetMs : Date.now() + DEFAULT_BLOCK_MS

    try {
        sessionStorage.setItem(BLOCK_KEY, String(until))
    } catch {
        // sessionStorage unavailable — nothing to back off with, next mount will just retry
    }
}

export default function GitHub() {
    const { t, i18n } = useTranslation()
    const [cachedData] = useState(() => readCache())
    const [blockedOnMount] = useState(() => !cachedData && isBlocked())
    const [profile, setProfile] = useState<GitHubProfile | null>(cachedData?.profile ?? null)
    const [repos, setRepos] = useState<Repo[]>(cachedData?.repos ?? [])
    const [activity, setActivity] = useState<CommitActivity[]>(cachedData?.activity ?? [])
    const [loading, setLoading] = useState(!cachedData && !blockedOnMount)
    const [errorReason, setErrorReason] = useState<'rateLimited' | 'generic' | null>(blockedOnMount ? 'rateLimited' : null)

    useEffect(() => {
        if (cachedData || blockedOnMount) return

        let mounted = true

        ; (async () => {
            try {
                const responses = await Promise.all([
                    fetch(`https://api.github.com/users/${GITHUB_USER}`),
                    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`),
                    fetch(`https://api.github.com/users/${GITHUB_USER}/events/public?per_page=30`),
                ])
                const [profileRes, reposRes, eventsRes] = responses

                if (responses.some((r) => r.status === 403)) {
                    recordBlock(responses)
                    throw new Error('rateLimited')
                }

                if (!reposRes.ok) throw new Error()
                const reposData: Repo[] = await reposRes.json()
                const filteredRepos = reposData
                    .filter((r) => !BLACKLIST.has(r.name))
                    .sort((a, b) => {
                        if (b.stargazers_count !== a.stargazers_count) return b.stargazers_count - a.stargazers_count
                        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                    })
                    .slice(0, MAX_REPOS)

                const profileData: GitHubProfile | null = profileRes.ok ? await profileRes.json() : null
                const activityData: CommitActivity[] = eventsRes.ok ? extractPushEvents(await eventsRes.json()) : []

                if (!mounted) return
                setRepos(filteredRepos)
                setProfile(profileData)
                setActivity(activityData)
                writeCache({ profile: profileData, repos: filteredRepos, activity: activityData })
            } catch (err) {
                if (mounted) setErrorReason(err instanceof Error && err.message === 'rateLimited' ? 'rateLimited' : 'generic')
            } finally {
                if (mounted) setLoading(false)
            }
        })()

        return () => { mounted = false }
    }, [cachedData, blockedOnMount])

    return (
        <IndexLayout id={INDEX_PATHS.GITHUB} className="flex-col">
            <header className="mb-10 w-full text-center">
                <h2 className="text-3xl font-semibold text-[var(--accent-text)] sm:text-4xl">{t('github.title')}</h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
                    {t('github.intro')}
                </p>
            </header>

            {loading ? (
                <div className="flex w-full flex-col gap-8">
                    <GitHubProfileSkeleton />
                    <CommitActivitySkeleton />
                    <ul className="grid w-full list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: MAX_REPOS }).map((_, i) => (
                            <li key={i} className="h-full">
                                <RepoCardSkeleton />
                            </li>
                        ))}
                    </ul>
                </div>
            ) : errorReason ? (
                <div className="flex w-full flex-col items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-card)] px-6 py-10 text-center">
                    <AlertTriangle size={22} className="text-[var(--accent-text)]" aria-hidden="true" />
                    <p className="text-sm text-[var(--text-muted)]">
                        {errorReason === 'rateLimited' ? t('github.rateLimited') : t('github.loadError')}
                    </p>
                </div>
            ) : (
                <div className="flex w-full flex-col gap-8">
                    {profile && (
                        <a
                            href={profile.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex w-full flex-col items-center gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-card)] p-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:color-mix(in_srgb,var(--accent)_30%,transparent)] hover:[box-shadow:0_8px_24px_color-mix(in_srgb,var(--accent)_15%,transparent)] sm:flex-row sm:items-center sm:text-left"
                        >
                            <img
                                src={profile.avatar_url}
                                alt={profile.login}
                                loading="lazy"
                                className="h-20 w-20 flex-shrink-0 rounded-full border-2 border-[var(--accent)] object-cover sm:h-24 sm:w-24"
                            />

                            <div className="flex flex-1 flex-col items-center gap-2 sm:items-start">
                                <div className="flex flex-col flex-wrap items-center justify-center sm:justify-start">
                                    <h3 className="text-xl font-bold text-[var(--text)] transition-colors group-hover:text-[var(--accent-text)]">
                                        {profile.name ?? profile.login}
                                    </h3>
                                    <span className="text-sm font-medium text-[var(--text-subtle)]">@{profile.login}</span>
                                </div>

                                {profile.bio && (
                                    <p className="max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">{profile.bio}</p>
                                )}

                                <div className="mt-1 flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--text-subtle)] sm:justify-start">
                                    <span className="flex items-center gap-1.5">
                                        <Users size={14} className="text-[var(--accent-text)]" aria-hidden="true" />
                                        {profile.followers} {t('github.followers')}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <FolderGit2 size={14} className="text-[var(--accent-text)]" aria-hidden="true" />
                                        {profile.public_repos} {t('github.publicRepos')}
                                    </span>
                                    {profile.location && (
                                        <span className="flex items-center gap-1.5">
                                            <MapPin size={14} className="text-[var(--accent-text)]" aria-hidden="true" />
                                            {profile.location}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <ExternalLink
                                size={16}
                                aria-hidden="true"
                                className="hidden flex-shrink-0 text-[var(--text-subtle)] transition-colors group-hover:text-[var(--accent-text)] sm:block"
                            />
                        </a>
                    )}

                    {activity.length > 0 && (
                        <div className="flex w-full flex-col gap-3">
                            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[var(--text-subtle)]">
                                <GitCommitHorizontal size={14} className="text-[var(--accent-text)]" aria-hidden="true" />
                                {t('github.recentActivity')}
                            </h3>

                            <ul className="m-0 flex list-none flex-col gap-2 p-0">
                                {activity.map((commit) => (
                                    <li key={commit.id}>
                                        <a
                                            href={`https://github.com/${commit.repo}/commit/${commit.sha}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-card)] px-4 py-3 text-sm transition-colors duration-200 hover:border-[color:color-mix(in_srgb,var(--accent)_30%,transparent)]"
                                        >
                                            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                                            <span className="flex-shrink-0 font-mono text-xs font-semibold text-[var(--text)]">
                                                {commit.repo.split('/')[1]}
                                            </span>
                                            <span className="min-w-0 flex-1 truncate text-[var(--text-muted)] transition-colors group-hover:text-[var(--text)]">
                                                {commit.message ?? t('github.pushedTo', { repo: commit.repo.split('/')[1] })}
                                            </span>
                                            <span className="flex-shrink-0 text-xs text-[var(--text-subtle)]">
                                                {formatRelativeTime(commit.date, i18n.language)}
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

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
                                        <h3 className="flex-1 break-words text-base font-semibold leading-snug text-[var(--text)] transition-colors group-hover:text-[var(--accent-text)]">
                                            {repo.name}
                                        </h3>
                                        <div className="flex shrink-0 items-center gap-3 text-sm text-[var(--text-subtle)]">
                                            {repo.stargazers_count > 0 && (
                                                <span className="flex items-center gap-1 text-[var(--accent-text)]">
                                                    <Star size={13} aria-hidden="true" />
                                                    {repo.stargazers_count}
                                                </span>
                                            )}
                                            {repo.forks_count > 0 && (
                                                <span className="flex items-center gap-1 text-[var(--accent-text)]">
                                                    <GitFork size={13} aria-hidden="true" />
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
                                            <span className="rounded-full bg-[color:color-mix(in_srgb,var(--accent)_10%,transparent)] px-2.5 py-0.5 text-sm font-medium text-[var(--accent-text)]">
                                                {repo.language}
                                            </span>
                                        ) : (
                                            <span />
                                        )}
                                        <span className="flex items-center gap-1 text-sm font-medium text-[var(--accent-text)] transition-[gap] duration-200 group-hover:gap-2">
                                            {t('github.viewRepo')}
                                            <ExternalLink size={11} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
                                        </span>
                                    </div>
                                </a>
                            </motion.li>
                        ))}
                    </motion.ul>
                </div>
            )}

            <div className="mt-10 flex justify-center">
                <a
                    href={`https://github.com/${GITHUB_USER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
                >
                    {t('github.visitProfile')}
                    <ExternalLink size={14} aria-hidden="true" />
                </a>
            </div>
        </IndexLayout>
    )
}
