interface TimelineCourse {
    name: string
    code?: string
    description: string
    link?: string
}

type Props = {
    event: {
        semester: string
        description: string
        courses: TimelineCourse[]
    }
}

export default function TimelineCard({ event }: Props) {
    return (
        <div className="pebble-set grid gap-4 md:grid-cols-2">
            {event.courses.map((course) => (
                <a
                    key={`${event.semester}-${course.code ?? course.name}`}
                    className="card-organic group block p-5 text-left hover:-translate-y-0.5"
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div className="mb-2 flex items-baseline justify-between gap-3">
                        <h4 className="m-0 text-[var(--text)] transition-colors group-hover:text-[var(--accent-text)]">
                            {course.name}
                        </h4>
                        {course.code ? (
                            <span className="shrink-0 font-mono text-xs text-[var(--text-subtle)]">
                                {course.code}
                            </span>
                        ) : null}
                    </div>
                    <p className="prose-organic m-0 text-[14.5px] leading-6 text-[var(--text-muted)]">
                        {course.description}
                    </p>
                </a>
            ))}
        </div>
    )
}
