import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, ExternalLink, FolderGit2, GitCommitHorizontal, GitFork, GitPullRequest, MapPin, Star, Users } from 'lucide-react'
import IndexLayout from './_layout'
import { readStored, writeStored } from '../../lib/cookieConsent'
import SectionHeading from '../ui/SectionHeading'
import { CommitActivitySkeleton, GitHubProfileSkeleton, RepoCardSkeleton } from '../ui/Skeleton'
import { INDEX_PATHS } from '../../routes/indexPaths'

const GITHUB_USER = 'EmilB04'
const BLACKLIST = new Set(['EmilB04', 'Kommunikasjonsdesign'])
const MAX_REPOS = 8
const MAX_ACTIVITY = 5
const RELATIVE_TIME_LOCALES: Record<string, string> = { no: 'nb' }
const CACHE_VERSION = 2 // bump when repo sort/shape changes to invalidate stale caches
const CACHE_KEY = `github-section:${GITHUB_USER}:v${CACHE_VERSION}`
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
    pushed_at: string
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
    payload: {
        head?: string
        action?: string
        pull_request?: { number: number }
    }
}

type PushActivity = {
    id: string
    kind: 'push'
    repo: string
    sha: string
    message: string | null
    date: string
}

type PullRequestActivity = {
    id: string
    kind: 'pr'
    repo: string
    action: 'opened' | 'merged' | 'closed' | 'reopened'
    title: string
    number: number
    url: string
    date: string
}

type ActivityItem = PushActivity | PullRequestActivity

const PR_ACTION_LABEL_KEYS = {
    opened: 'github.prOpened',
    merged: 'github.prMerged',
    closed: 'github.prClosed',
    reopened: 'github.prReopened',
} as const

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

type RawActivity =
    | { id: string; kind: 'push'; repo: string; sha: string; date: string }
    | { id: string; kind: 'pr'; repo: string; number: number; action: PullRequestActivity['action']; date: string }

// GitHub's public /events payload is stripped down — no commit messages, no PR title/url.
// This only picks out which events matter and their IDs; enrichActivity fetches the rest.
function extractRawActivity(events: GitHubEvent[]): RawActivity[] {
    const items: RawActivity[] = []

    // The feed is ordered by event id, not created_at — events seconds apart come back
    // out of order, so sort before slicing to MAX_ACTIVITY.
    const sorted = [...events].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    for (const event of sorted) {
        if (items.length >= MAX_ACTIVITY) break

        if (event.type === 'PushEvent' && event.payload.head) {
            items.push({ id: event.id, kind: 'push', repo: event.repo.name, sha: event.payload.head, date: event.created_at })
            continue
        }

        if (event.type === 'PullRequestEvent' && event.payload.pull_request) {
            const action = event.payload.action
            if (action !== 'opened' && action !== 'merged' && action !== 'closed' && action !== 'reopened') continue

            items.push({
                id: event.id,
                kind: 'pr',
                repo: event.repo.name,
                number: event.payload.pull_request.number,
                action,
                date: event.created_at,
            })
        }
    }

    return items
}

async function enrichActivity(raw: RawActivity[]): Promise<ActivityItem[]> {
    return Promise.all(raw.map(async (item): Promise<ActivityItem> => {
        if (item.kind === 'push') {
            try {
                const res = await fetch(`https://api.github.com/repos/${item.repo}/commits/${item.sha}`)
                const data = res.ok ? await res.json() as { commit?: { message?: string } } : null
                const message = data?.commit?.message?.split('\n')[0]?.trim() || null
                return { id: item.id, kind: 'push', repo: item.repo, sha: item.sha, date: item.date, message }
            } catch {
                return { id: item.id, kind: 'push', repo: item.repo, sha: item.sha, date: item.date, message: null }
            }
        }

        const fallbackUrl = `https://github.com/${item.repo}/pull/${item.number}`
        try {
            const res = await fetch(`https://api.github.com/repos/${item.repo}/pulls/${item.number}`)
            const data = res.ok ? await res.json() as { title?: string; html_url?: string } : null
            return {
                id: item.id,
                kind: 'pr',
                repo: item.repo,
                action: item.action,
                number: item.number,
                date: item.date,
                title: data?.title ?? `#${item.number}`,
                url: data?.html_url ?? fallbackUrl,
            }
        } catch {
            return { id: item.id, kind: 'pr', repo: item.repo, action: item.action, number: item.number, date: item.date, title: `#${item.number}`, url: fallbackUrl }
        }
    }))
}

type CachedGitHubData = {
    profile: GitHubProfile | null
    repos: Repo[]
    activity: ActivityItem[]
    cachedAt: number
}

// Without cookie consent nothing may be kept on the device, so the cache and
// the rate-limit backoff fall back to module state: they still spare GitHub a
// second round of calls within this page view, and vanish when it closes.
let memoryCache: CachedGitHubData | null = null
let memoryBlockedUntil = 0

function readCache(): CachedGitHubData | null {
    const raw = readStored(CACHE_KEY, 'session')
    let parsed: CachedGitHubData | null = memoryCache

    if (raw) {
        try {
            parsed = JSON.parse(raw) as CachedGitHubData
        } catch {
            parsed = memoryCache
        }
    }

    if (!parsed) return null
    if (Date.now() - parsed.cachedAt > CACHE_TTL_MS) return null
    return parsed
}

function writeCache(data: Omit<CachedGitHubData, 'cachedAt'>) {
    const entry = { ...data, cachedAt: Date.now() }
    memoryCache = entry
    writeStored(CACHE_KEY, JSON.stringify(entry), 'session')
}

function isBlocked(): boolean {
    const stored = Number(readStored(BLOCK_KEY, 'session'))
    const until = Number.isFinite(stored) && stored > 0 ? stored : memoryBlockedUntil
    return until > Date.now()
}

function recordBlock(responses: Response[]) {
    const resetHeader = responses.find((r) => r.status === 403)?.headers.get('X-RateLimit-Reset')
    const resetMs = resetHeader ? Number(resetHeader) * 1000 : NaN
    const until = Number.isFinite(resetMs) && resetMs > Date.now() ? resetMs : Date.now() + DEFAULT_BLOCK_MS

    memoryBlockedUntil = until
    writeStored(BLOCK_KEY, String(until), 'session')
}

export default function GitHub() {
    const { t, i18n } = useTranslation()
    const [cachedData] = useState(() => readCache())
    const [blockedOnMount] = useState(() => !cachedData && isBlocked())
    const [profile, setProfile] = useState<GitHubProfile | null>(cachedData?.profile ?? null)
    const [repos, setRepos] = useState<Repo[]>(cachedData?.repos ?? [])
    const [activity, setActivity] = useState<ActivityItem[]>(cachedData?.activity ?? [])
    const [loading, setLoading] = useState(!cachedData && !blockedOnMount)
    const [errorReason, setErrorReason] = useState<'rateLimited' | 'generic' | null>(blockedOnMount ? 'rateLimited' : null)

    useEffect(() => {
        if (cachedData || blockedOnMount) return

        let mounted = true

        ; (async () => {
            try {
                const responses = await Promise.all([
                    fetch(`https://api.github.com/users/${GITHUB_USER}`),
                    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed&direction=desc`),
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
                    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
                    .slice(0, MAX_REPOS)

                const profileData: GitHubProfile | null = profileRes.ok ? await profileRes.json() : null
                const rawActivity = eventsRes.ok ? extractRawActivity(await eventsRes.json()) : []
                const activityData = await enrichActivity(rawActivity)

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
        <IndexLayout id={INDEX_PATHS.GITHUB}>
            <SectionHeading
                title={t('github.title')}
                lead={t('github.intro')}
                aside={
                    <a
                        href={`https://github.com/${GITHUB_USER}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[15px] font-medium text-[var(--accent-text)]"
                    >
                        {t('github.visitProfile')}
                        <ExternalLink size={14} aria-hidden="true" />
                    </a>
                }
            />

            {loading ? (
                <div className="flex w-full flex-col gap-10">
                    <GitHubProfileSkeleton />
                    <CommitActivitySkeleton />
                    <ul className="grid w-full list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 min-[1280px]:grid-cols-3">
                        {Array.from({ length: MAX_REPOS }).map((_, i) => (
                            <li key={i} className="h-full">
                                <RepoCardSkeleton />
                            </li>
                        ))}
                    </ul>
                </div>
            ) : errorReason ? (
                <div className="card-organic pebble flex w-full flex-col items-center gap-2 px-6 py-10 text-center">
                    <AlertTriangle size={22} className="text-[var(--accent-text)]" aria-hidden="true" />
                    <p className="text-sm text-[var(--text-muted)]">
                        {errorReason === 'rateLimited' ? t('github.rateLimited') : t('github.loadError')}
                    </p>
                </div>
            ) : (
                <div className="flex w-full flex-col gap-12">
                    {profile && (
                        <a
                            href={profile.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex w-full flex-col gap-5 md:flex-row md:items-center md:gap-7"
                        >
                            <img
                                src={profile.avatar_url}
                                alt={profile.login}
                                loading="lazy"
                                className="h-24 w-24 flex-shrink-0 object-cover"
                                style={{ borderRadius: 'var(--pebble-b)', boxShadow: 'var(--shadow)' }}
                            />

                            <div className="flex flex-1 flex-col gap-2">
                                <div className="flex flex-wrap items-baseline gap-x-3">
                                    <h3 className="m-0 text-[var(--text)] transition-colors group-hover:text-[var(--accent-text)]">
                                        {profile.name ?? profile.login}
                                    </h3>
                                    <span className="font-mono text-sm text-[var(--text-subtle)]">@{profile.login}</span>
                                </div>

                                {profile.bio && (
                                    <p className="prose-organic max-w-xl text-[15px] text-[var(--text-muted)]">{profile.bio}</p>
                                )}

                                <div className="mt-1 flex flex-wrap items-center gap-5 text-sm text-[var(--text-subtle)]">
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
                        </a>
                    )}

                    {activity.length > 0 && (
                        <div className="flex w-full flex-col">
                            {/* A log reads as a log: rows divided by hairlines, newest first. */}
                            <div className="mb-3 flex items-center gap-4">
                                <h3 className="m-0 flex shrink-0 items-center gap-2 text-base font-medium text-[var(--text)]">
                                    <GitCommitHorizontal size={15} className="text-[var(--accent-text)]" aria-hidden="true" />
                                    {t('github.recentActivity')}
                                </h3>
                                <span className="h-px flex-1" style={{ background: 'var(--border)' }} aria-hidden="true" />
                            </div>

                            <ul className="m-0 flex list-none flex-col p-0">
                                {activity.map((item) => (
                                    <li key={item.id} className="border-b border-[var(--border)] last:border-b-0">
                                        <a
                                            href={item.kind === 'push'
                                                ? `https://github.com/${item.repo}/commit/${item.sha}`
                                                : item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-3 py-3 text-sm"
                                        >
                                            {item.kind === 'push' ? (
                                                <GitCommitHorizontal size={14} className="flex-shrink-0 text-[var(--text-subtle)]" aria-hidden="true" />
                                            ) : (
                                                <GitPullRequest size={14} className="flex-shrink-0 text-[var(--text-subtle)]" aria-hidden="true" />
                                            )}
                                            <span className="flex-shrink-0 font-mono text-xs text-[var(--accent-text)]">
                                                {item.repo.split('/')[1]}
                                            </span>
                                            <span className="min-w-0 flex-1 truncate text-[var(--text-muted)] transition-colors group-hover:text-[var(--text)]">
                                                {item.kind === 'push'
                                                    ? item.message ?? t('github.pushedTo', { repo: item.repo.split('/')[1] })
                                                    : `${t(PR_ACTION_LABEL_KEYS[item.action])}: ${item.title}`}
                                            </span>
                                            <span className="flex-shrink-0 text-xs text-[var(--text-subtle)]">
                                                {formatRelativeTime(item.date, i18n.language)}
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <ul className="pebble-set grid w-full list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 min-[1280px]:grid-cols-3">
                        {repos.map((repo) => (
                            <li key={repo.id} className="card-organic h-full">
                                <a
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-full cursor-pointer flex-col gap-4 p-6 text-left"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="m-0 flex-1 break-words text-base font-semibold leading-snug text-[var(--text)]">
                                            {repo.name}
                                        </h3>
                                        <div className="flex shrink-0 items-center gap-3 text-sm text-[var(--text-subtle)]">
                                            {repo.stargazers_count > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Star size={13} aria-hidden="true" />
                                                    {repo.stargazers_count}
                                                </span>
                                            )}
                                            {repo.forks_count > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <GitFork size={13} aria-hidden="true" />
                                                    {repo.forks_count}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <p className="prose-organic line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
                                        {repo.description ?? t('github.noDescription')}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
                                        {repo.language ? (
                                            <span className="text-sm text-[var(--text-muted)]">{repo.language}</span>
                                        ) : (
                                            <span />
                                        )}
                                        <span className="flex items-center gap-1.5 text-sm font-medium text-[var(--accent-text)]">
                                            {t('github.viewRepo')}
                                            <ExternalLink size={11} aria-hidden="true" />
                                        </span>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </IndexLayout>
    )
}
