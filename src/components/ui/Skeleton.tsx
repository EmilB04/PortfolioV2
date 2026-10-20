export function Skeleton({ className = '' }: { className?: string }) {
    return <div className={`animate-pulse rounded-md bg-[var(--surface-sunken)] ${className}`} />
}

export function ProjectCardSkeleton({ view = 'grid' }: { view?: 'grid' | 'list' }) {
    return (
        <div className={`card-organic project-card project-card--${view}`}>
            <div className="project-card__heading">
                <Skeleton className="h-9 w-9 shrink-0" />
                <Skeleton className="h-5 w-32 max-w-full" />
            </div>
            <div className="project-card__description project-card__description--loading">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-2/3" />
            </div>
            <div className="project-card__stack">
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-3 w-16" />
            </div>
            <span className="project-card__action"><Skeleton className="h-4 w-20" /></span>
        </div>
    )
}

export function RepoCardSkeleton() {
    return (
        <div className="pebble-b flex h-full flex-col gap-4 border border-[var(--border)] bg-[var(--surface-card)] p-6">
            <div className="flex items-start justify-between gap-4">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-10" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-3/4" />
            </div>
            <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-20" />
            </div>
        </div>
    )
}

export function GitHubProfileSkeleton() {
    return (
        <div className="pebble flex w-full flex-col gap-5 border border-[var(--border)] bg-[var(--surface-card)] p-6 md:flex-row md:items-center">
            <Skeleton className="h-20 w-20 shrink-0 rounded-full sm:h-24 sm:w-24" />
            <div className="flex w-full flex-1 flex-col items-center gap-2 sm:items-start">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-full max-w-sm" />
                <Skeleton className="h-3 w-2/3 max-w-sm" />
                <div className="mt-1 flex gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>
        </div>
    )
}

export function CommitActivitySkeleton() {
    return (
        <div className="flex w-full flex-col gap-3">
            <Skeleton className="h-3 w-32" />
            <div className="flex flex-col gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="pebble-sm flex items-center gap-3 border border-[var(--border)] bg-[var(--surface-card)] px-4 py-3"
                    >
                        <Skeleton className="h-1.5 w-1.5 shrink-0 rounded-full" />
                        <Skeleton className="h-3 w-20 shrink-0" />
                        <Skeleton className="h-3 flex-1" />
                        <Skeleton className="h-3 w-10 shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export function FeaturedProjectsSkeleton() {
    return (
        <div className="w-full overflow-hidden">
            <div className="mb-5 flex gap-2 overflow-x-auto pb-1 sm:hidden">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-9 w-24 shrink-0 rounded-full" />
                ))}
            </div>

            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-[200px_1fr]">
                <div className="hidden min-w-0 flex-col gap-2 sm:flex">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="pebble-sm h-16 w-full" />
                    ))}
                </div>

                <div
                    className="pebble min-w-0 overflow-hidden border border-[var(--border)] bg-[var(--surface-card)] p-6"
                    style={{ minHeight: '320px' }}
                >
                    <div className="flex flex-col gap-5">
                        <Skeleton className="h-6 w-40" />
                        <div className="flex gap-1.5">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                        </div>
                        <Skeleton className="pebble aspect-video w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export function TimelineSkeleton() {
    return (
        <ol className="flex flex-col gap-10">
            {Array.from({ length: 3 }).map((_, i) => {
                const isLeft = i % 2 === 0
                return (
                    <li
                        key={i}
                        className="grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-x-4 md:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] md:gap-x-0"
                    >
                        <div className="col-start-1 flex justify-center md:col-start-2 md:self-start">
                            <span
                                aria-hidden="true"
                                className="mt-4 inline-flex h-[0.95rem] w-[0.95rem] shrink-0 animate-pulse rounded-full bg-[var(--border)]"
                            />
                        </div>

                        <div
                            className={[
                                'col-start-2 w-full min-w-0 md:flex md:max-w-xl md:flex-col',
                                isLeft
                                    ? 'md:col-start-1 md:justify-self-end md:pr-10'
                                    : 'md:col-start-3 md:justify-self-start md:pl-10',
                            ].join(' ')}
                        >
                            <div className={['flex flex-col gap-3', isLeft ? 'items-end' : 'items-start'].join(' ')}>
                                <Skeleton className="h-7 w-40" />
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="pebble h-40 w-full max-w-md" />
                            </div>
                        </div>
                    </li>
                )
            })}
        </ol>
    )
}

export function ProjectDetailSkeleton() {
    return (
        <div className="w-full">
            <div className="mb-4 flex flex-col items-start gap-3">
                <Skeleton className="h-10 w-72 max-w-full" />
            </div>

            <div className="mb-10 flex flex-col items-start gap-2">
                <Skeleton className="h-3 w-24" />
                <div className="flex flex-wrap gap-1.5">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_15rem]">
                <div className="flex flex-col gap-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="pebble aspect-video w-full" />
                </div>

                <div className="flex flex-col gap-2">
                    <Skeleton className="h-10 w-full rounded-full" />
                    <Skeleton className="h-10 w-full rounded-full" />
                </div>
            </div>
        </div>
    )
}
