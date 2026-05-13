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
        <div className="mt-1 flex flex-col gap-4">
            {event.courses.map((course) => (
                <a
                    key={`${event.semester}-${course.code ?? course.name}`}
                    className="group rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] p-4 text-left transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--accent-border)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.22)]"
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h4 className="m-0 mb-1 text-lg font-bold text-[var(--text)] transition-colors group-hover:text-[var(--text-muted)] sm:text-xl">
                        {course.name}
                    </h4>
                    {course.code ? (
                        <p className="m-0 text-sm font-semibold text-[var(--accent)] sm:text-[0.9rem]">
                            {course.code}
                        </p>
                    ) : null}
                    <p className="m-0 mt-2 text-sm leading-6 text-[var(--text-muted)] sm:text-[0.95rem]">
                        {course.description}
                    </p>
                </a>
            ))}
        </div>
    )
}
