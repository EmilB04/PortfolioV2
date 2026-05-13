import IndexLayout from './_layout'
import { INDEX_PATHS } from '../../routes/indexPaths'
import TimelineCard from './TimelineCard'
import { fetchCoursesOnce } from '../../hooks/useCourses'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface TimelineCourse {
    name: string
    code?: string
    description: string
    link?: string
}

interface TimelineSemesterEvent {
    semester: string
    description: string
    courses: TimelineCourse[]
}

type TimelineEntry =
    | ({ kind: 'semester' } & TimelineSemesterEvent)
    | {
        kind: 'intro' | 'outro'
        title: string
        description: string
    }

type SemesterRow = {
    id: number
    semester: string
    courses: TimelineCourse[]
}

export default function Timeline() {
    const { t } = useTranslation()
    const [courseData, setCourseData] = useState<TimelineSemesterEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const formatSemesterName = (semester: string) => {
        const match = semester.match(/^(Vår|Høst|Spring|Autumn|Primavera|Otoño)\s+(\d{4})$/i)

        if (!match) return semester

        const seasonToken = match[1].toLowerCase()
        const year = match[2]

        const seasonKey =
            seasonToken === 'vår' || seasonToken === 'spring' || seasonToken === 'primavera'
                ? 'spring'
                : 'autumn'

        return `${t(`timeline.seasons.${seasonKey}`)} ${year}`
    }

    useEffect(() => {
        const run = async () => {
            try {
                setLoading(true)
                setError(null)

                const result = (await fetchCoursesOnce()) as SemesterRow[]
                setCourseData(
                    result.map((row) => ({
                        semester: row.semester,
                        description: t('timeline.semesterLabel', { number: row.id }),
                        courses: row.courses,
                    })),
                )
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error')
            } finally {
                setLoading(false)
            }
        }

        void run()
    }, [t])

    const events: TimelineEntry[] = courseData.map((row) => ({
        kind: 'semester' as const,
        semester: formatSemesterName(row.semester),
        description: row.description,
        courses: row.courses,
    }))

    const renderEntryContent = (entry: TimelineEntry, isLeft: boolean) => {
        if (entry.kind === 'semester') {
            return (
                <>
                    <header
                        className={['mb-4 flex flex-col gap-1', isLeft ? 'items-end' : 'items-start'].join(' ')}
                    >
                        <h3 className="text-2xl font-semibold text-[var(--accent)] sm:text-3xl">
                            {entry.semester}
                        </h3>
                        <p className="text-sm font-medium text-[var(--text-subtle)]">
                            <time>{entry.description}</time>
                        </p>
                    </header>

                    <TimelineCard event={entry} />
                </>
            )
        }

        return (
            <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.12)] sm:p-6">
                <h3 className="m-0 text-2xl font-semibold text-[var(--accent)] sm:text-3xl">
                    {entry.title}
                </h3>
                <p className="mt-2 text-sm font-medium text-[var(--text-subtle)] sm:text-base">
                    {entry.description}
                </p>
            </div>
        )
    }

    return (
        <IndexLayout id={INDEX_PATHS.TIMELINE} className="flex-col items-center">
            <header className="mb-10 w-full text-center">
                <h2 className="text-3xl font-semibold sm:text-4xl">{t('timeline.title')}</h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
                    {t('timeline.intro')}
                </p>
            </header>

            <section aria-label="Tidslinje over studieemner" className="relative w-full max-w-6xl">
                <div aria-hidden="true" className="absolute left-4 top-0 bottom-0 w-px -translate-x-1/2 bg-[var(--accent)] md:left-1/2" />

                {loading ? (
                    <p className="text-center text-sm text-[var(--text-muted)]">{t('timeline.loading')}</p>
                ) : error ? (
                    <p className="text-center text-sm text-red-500">{t('timeline.error', { error })}</p>
                ) : (
                    <ol className="flex flex-col gap-10">
                        {events.map((event, index) => {
                            const isLeft = index % 2 === 0

                            return (
                                <li
                                    key={event.kind === 'semester' ? event.semester : `${event.kind}-${index}`}
                                    className="grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-x-4 md:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] md:gap-x-0"
                                >
                                    <div className="col-start-1 flex justify-center md:col-start-2 md:self-start">
                                        <span
                                            aria-hidden="true"
                                            className="mt-4 inline-flex h-[0.95rem] w-[0.95rem] flex-shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_0_6px_color-mix(in_srgb,var(--accent)_18%,transparent)]"
                                        />
                                    </div>

                                    <div
                                        className={[
                                            'col-start-2 w-full min-w-0 md:flex md:max-w-xl md:flex-col',
                                            isLeft
                                                ? 'md:col-start-1 md:justify-self-end md:pr-10 md:text-right'
                                                : 'md:col-start-3 md:justify-self-start md:pl-10 md:text-left',
                                        ].join(' ')}
                                    >
                                        <div className={['flex flex-col', isLeft ? 'items-end' : 'items-start'].join(' ')}>
                                            {renderEntryContent(event, isLeft)}
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ol>
                )}
            </section>
        </IndexLayout>
    )
}
