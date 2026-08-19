import IndexLayout from './_layout'
import { INDEX_PATHS } from '../../routes/indexPaths'
import TimelineCard from './TimelineCard'
import { TimelineSkeleton } from '../ui/Skeleton'
import { fetchCoursesOnce } from '../../hooks/useCourses'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// Semesters 1-6 are the bachelor programme; everything after belongs to the
// master, which restarts its own semester numbering at 1.
const BACHELOR_SEMESTER_COUNT = 6

interface TimelineCourse {
    name: string
    code?: string
    description: string
    link?: string
}

interface TimelineSemesterEvent {
    id: number
    semester: string
    description: string
    courses: TimelineCourse[]
}

type DegreeLevel = 'bachelor' | 'master'

interface TimelineChapter {
    level: DegreeLevel
    kicker: string
    title: string
    description: string
    semesters: TimelineSemesterEvent[]
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
                        id: row.id,
                        semester: row.semester,
                        description:
                            row.id > BACHELOR_SEMESTER_COUNT
                                ? t('timeline.semesterLabelMaster', {
                                    number: row.id - BACHELOR_SEMESTER_COUNT,
                                })
                                : t('timeline.semesterLabel', { number: row.id }),
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

    // Split into one chapter per degree, each with its own independent
    // timeline that starts right after the chapter intro and ends before
    // the next one begins.
    const chapters: TimelineChapter[] = []

    for (const row of courseData) {
        const level: DegreeLevel = row.id > BACHELOR_SEMESTER_COUNT ? 'master' : 'bachelor'
        let chapter = chapters.find((entry) => entry.level === level)

        if (!chapter) {
            chapter = {
                level,
                kicker: t(`timeline.degrees.${level}.kicker`),
                title: t(`timeline.degrees.${level}.title`),
                description: t(`timeline.degrees.${level}.description`),
                semesters: [],
            }
            chapters.push(chapter)
        }

        chapter.semesters.push({
            id: row.id,
            semester: formatSemesterName(row.semester),
            description: row.description,
            courses: row.courses,
        })
    }

    const totalCourses = courseData.reduce((sum, row) => sum + row.courses.length, 0)
    // Two semesters per academic year, rounded up so an ongoing year still counts.
    const yearsOfStudy = Math.ceil(courseData.length / 2)

    const stats = [
        { value: yearsOfStudy > 0 ? String(yearsOfStudy) : '—', label: t('timeline.stats.years') },
        { value: totalCourses > 0 ? String(totalCourses) : '—', label: t('timeline.stats.courses') },
        { value: 'HiØ', label: t('timeline.stats.institution') },
    ]

    return (
        <IndexLayout id={INDEX_PATHS.TIMELINE} className="flex-col items-center">
            <header className="mb-10 w-full text-center">
                <h2 className="text-3xl font-semibold sm:text-4xl">{t('timeline.title')}</h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
                    {t('timeline.intro')}
                </p>
            </header>

            <div className="mb-12 grid w-full max-w-3xl grid-cols-3 divide-x divide-[var(--border)] rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-card)] px-2 py-6 sm:px-4 sm:py-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center px-2 text-center sm:px-4">
                        <span className="text-3xl font-extrabold leading-none text-[var(--accent-text)] sm:text-4xl">
                            {stat.value}
                        </span>
                        <span className="mt-2 text-xs font-medium text-[var(--text-subtle)] sm:text-sm">
                            {stat.label}
                        </span>
                    </div>
                ))}
            </div>

            {loading ? (
                <TimelineSkeleton />
            ) : error ? (
                <p className="text-center text-sm text-red-500">{t('timeline.error', { error })}</p>
            ) : (
                <div className="flex w-full max-w-screen-xl flex-col gap-16">
                    {chapters.map((chapter) => (
                        <div key={chapter.level} className="flex flex-col items-center">
                            <div className="w-full max-w-2xl rounded-[1.75rem] border border-[var(--accent)] bg-[var(--surface-card)] p-5 text-center shadow-[0_12px_30px_rgba(0,0,0,0.12)] sm:p-6">
                                <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-subtle)]">
                                    {chapter.kicker}
                                </p>
                                <h3 className="mt-2 text-2xl font-semibold text-[var(--accent-text)] sm:text-3xl">
                                    {chapter.title}
                                </h3>
                                <p className="mt-2 text-sm font-medium text-[var(--text-subtle)] sm:text-base">
                                    {chapter.description}
                                </p>
                            </div>

                            <section aria-label={chapter.title} className="relative mt-10 w-full">
                                <div
                                    aria-hidden="true"
                                    className="absolute left-4 top-0 bottom-0 w-px -translate-x-1/2 bg-[var(--accent)] md:left-1/2"
                                />

                                <ol className="flex flex-col gap-10">
                                    {chapter.semesters.map((semester, index) => {
                                        const isLeft = index % 2 === 0

                                        return (
                                            <li
                                                key={semester.semester}
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
                                                        <header
                                                            className={[
                                                                'mb-4 flex flex-col gap-1',
                                                                isLeft ? 'items-end' : 'items-start',
                                                            ].join(' ')}
                                                        >
                                                            <h3 className="text-2xl font-semibold text-[var(--accent-text)] sm:text-3xl">
                                                                {semester.semester}
                                                            </h3>
                                                            <p className="text-sm font-medium text-[var(--text-subtle)]">
                                                                <time>{semester.description}</time>
                                                            </p>
                                                        </header>

                                                        <TimelineCard event={semester} />
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ol>
                            </section>
                        </div>
                    ))}
                </div>
            )}
        </IndexLayout>
    )
}
