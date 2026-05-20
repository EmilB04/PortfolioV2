import type { Project } from '../hooks/useProjects'
import { useTranslation } from 'react-i18next'

export default function ProjectCard({ project }: { project: Project }) {
    const { t } = useTranslation()
    const firstImage = project.images?.[0] ?? ''

    return (
        <article className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-shadow hover:shadow-md">
            {firstImage && (
                <div className="overflow-hidden border-b border-[var(--border)] bg-black/5">
                    <img
                        src={firstImage}
                        alt={project.title}
                        className="h-44 w-full object-cover"
                        loading="lazy"
                    />
                </div>
            )}
            <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="text-lg font-semibold text-[var(--text)]">{project.title}</h3>
                <p className="flex-1 text-sm text-[var(--text-muted)]">{project.description}</p>
                {project.languages?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {project.languages.map((lang) => (
                            <span
                                key={lang}
                                className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-subtle)]"
                            >
                                {lang}
                            </span>
                        ))}
                    </div>
                )}
                {project.url && (
                    <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-[var(--accent)] hover:underline"
                    >
                        {t('projectCard.github')}
                    </a>
                )}
            </div>
        </article>
    )
}
