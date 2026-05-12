import IndexLayout from './_layout'
import { INDEX_PATHS } from '../../routes/indexPaths'
import TimelineCard from './TimelineCard'

interface TimelineCourse {
  name: string
  code?: string
  description: string
  link?: string
}

interface TimelineSemesterEvent {
  semester: string
  date: string
  courses: TimelineCourse[]
}

type TimelineEntry =
  | ({ kind: 'semester' } & TimelineSemesterEvent)
  | {
      kind: 'intro' | 'outro'
      title: string
      description: string
    }

export default function Timeline() {
  const events: TimelineEntry[] = [
    {
      kind: 'intro',
      title: 'Start',
      description: 'Start of Bachelor',
    },
    {
      kind: 'semester',
      semester: 'Høst 2023',
      date: '1. semester',
      courses: [
        {
          name: 'Programmering 1',
          code: 'ITF10219',
          description: 'Innføring i programmering og programmeringsspråket Python.',
          link: 'https://www.hiof.no/studier/emner/iio/itk/2023/host/itf10219.html',
        },
        {
          name: 'Webutvikling',
          code: 'ITF10511',
          description: 'Innføring i webutvikling med HTML, CSS og SCSS.',
          link: 'https://www.hiof.no/studier/emner/iio/itk/2023/host/itf10511.html',
        },
      ],
    },
    {
      kind: 'semester',
      semester: 'Vår 2024',
      date: '2. semester',
      courses: [
        {
          name: 'Programmering 2',
          code: 'ITF20219',
          description: 'Videreføring i programmering med Java.',
          link: 'https://www.hiof.no/studier/emner/iio/itk/2024/var/itf20219.html',
        },
        {
          name: 'Databasesystemer',
          code: 'ITF20511',
          description: 'Innføring i databasesystemer og MySQL.',
          link: 'https://www.hiof.no/studier/emner/iio/itk/2024/var/itf20511.html',
        },
      ],
    },
    {
      kind: 'semester',
      semester: 'Høst 2024',
      date: '3. semester',
      courses: [
        {
          name: 'Innføring i operativsystemer',
          code: 'ITF22519',
          description: 'Innføring i operativsystemer og C-programmering.',
          link: 'https://www.hiof.no/studier/emner/iio/itk/2024/host/itf22519.html',
        },
        {
          name: 'Diskret matematikk',
          code: 'ITF10705',
          description: 'Diskret matematikk og matematiske bevis.',
          link: 'https://www.hiof.no/studier/emner/iio/itk/2024/host/itf10705.html',
        },
      ],
    },
    {
      kind: 'semester',
      semester: 'Vår 2025',
      date: '4. semester',
      courses: [
        {
          name: 'Rammeverk og .NET',
          code: 'ITF20123',
          description: 'Innføring i rammeverk og .NET med C#.',
          link: 'https://www.hiof.no/studier/emner/iio/itk/2025/var/itf20123.html',
        },
        {
          name: 'Algoritmer og datastrukturer',
          code: 'ITF20006',
          description: 'Innføring i algoritmer og datastrukturer.',
          link: 'https://www.hiof.no/studier/emner/iio/itk/2025/var/itf20006.html',
        },
      ],
    },
    {
      kind: 'outro',
      title: 'End',
      description: 'End of Bachelor',
    },
  ]

  const renderEntryContent = (entry: TimelineEntry, isLeft: boolean) => {
    if (entry.kind === 'semester') {
      return (
        <>
          <header
            className={[
              'mb-4 flex flex-col gap-1',
              isLeft ? 'items-end' : 'items-start',
            ].join(' ')}
          >
            <h3 className="text-2xl font-semibold text-[var(--accent)] sm:text-3xl">
              {entry.semester}
            </h3>
            <p className="text-sm font-medium text-[var(--text-subtle)]">
              <time>{entry.date}</time>
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
      <h2 className="text-3xl font-semibold sm:text-4xl">Tidslinje</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
        Under er en oversikt over emnene jeg har gjennomført under studiene mine på HiØ.
      </p>
    </header>

    <section
      aria-label="Tidslinje over studieemner"
      className="relative w-full max-w-6xl"
    >
      {/* Vertical line */}
      <div
        aria-hidden="true"
        className="absolute left-4 top-0 bottom-0 w-px -translate-x-1/2 bg-[var(--accent)] md:left-1/2"
      />

      <ol className="flex flex-col gap-10">
        {events.map((event, index) => {
          const isLeft = index % 2 === 0

          return (
            <li
              key={event.kind === 'semester' ? event.semester : `${event.kind}-${index}`}
              className="grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-x-4 md:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] md:gap-x-0"
            >
              {/* Marker */}
              <div className="col-start-1 flex justify-center md:col-start-2 md:self-start">
                <span
                  aria-hidden="true"
                  className="mt-4 inline-flex h-[0.95rem] w-[0.95rem] flex-shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_0_6px_color-mix(in_srgb,var(--accent)_18%,transparent)]"
                />
              </div>

              {/* Content */}
              <div
                className={[
                  "col-start-2 w-full min-w-0 md:flex md:max-w-xl md:flex-col",
                  isLeft
                    ? "md:col-start-1 md:justify-self-end md:pr-10 md:text-right"
                    : "md:col-start-3 md:justify-self-start md:pl-10 md:text-left",
                ].join(" ")}
              >
                <div
                  className={[
                    'flex flex-col',
                    isLeft ? 'items-end' : 'items-start',
                  ].join(' ')}
                >
                  {renderEntryContent(event, isLeft)}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  </IndexLayout>
  )
}