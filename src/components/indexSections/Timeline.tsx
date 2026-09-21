import IndexLayout from './_layout'
import SectionHeading from '../ui/SectionHeading'
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
        <IndexLayout id={INDEX_PATHS.TIMELINE}>
            <SectionHeading title={t('timeline.title')} lead={t('timeline.intro')} />

            {/* Three facts, set as measurements rather than boxed KPI tiles. */}
            <dl className="mb-16 flex flex-wrap items-baseline gap-x-12 gap-y-6 border-y border-[var(--border)] py-7">
                {stats.map((stat) => (
                    <div key={stat.label} className="flex items-baseline gap-3">
                        <dd className="m-0 text-4xl font-semibold leading-none text-[var(--accent-text)]">
                            {stat.value}
                        </dd>
                        <dt className="text-[15px] text-[var(--text-muted)]">{stat.label}</dt>
                    </div>
                ))}
            </dl>

            {loading ? (
                <TimelineSkeleton />
            ) : error ? (
                <p className="text-sm text-red-500">{t('timeline.error', { error })}</p>
            ) : (
                <div className="flex w-full flex-col gap-20">
                    {chapters.map((chapter) => (
                        <div key={chapter.level}>
                            <div className="mb-10 max-w-2xl">
                                <p className="m-0 mb-2 text-sm text-[var(--text-subtle)]">{chapter.kicker}</p>
                                <h3 className="mb-2 text-[var(--text)]">{chapter.title}</h3>
                                <p className="prose-organic text-[var(--text-muted)]">{chapter.description}</p>
                            </div>

                            {/* One rail down the left. Semesters hang off it in the order
                                they happened; nothing alternates sides, so the courses
                                stay in a single column of reading. */}
                            <section aria-label={chapter.title} className="relative pl-7 md:pl-10">
                                <span
                                    aria-hidden="true"
                                    className="absolute left-[5px] top-2 bottom-2 w-px md:left-[7px]"
                                    style={{ background: 'var(--border-strong)' }}
                                />

                                <ol className="flex flex-col gap-14">
                                    {chapter.semesters.map((semester) => (
                                        <li key={semester.semester} className="relative">
                                            <span
                                                aria-hidden="true"
                                                className="absolute -left-7 top-[0.55rem] h-[11px] w-[11px] md:-left-10"
                                                style={{
                                                    background: 'var(--accent)',
                                                    borderRadius: 'var(--pebble-sm)',
                                                }}
                                            />

                                            <header className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                                                <h3 className="m-0 text-[var(--text)]">{semester.semester}</h3>
                                                <p className="text-sm text-[var(--text-subtle)]">
                                                    <time>{semester.description}</time>
                                                </p>
                                            </header>

                                            <TimelineCard event={semester} />
                                        </li>
                                    ))}
                                </ol>
                            </section>
                        </div>
                    ))}
                </div>
            )}
        </IndexLayout>
    )
}
