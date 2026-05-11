import type { Project } from '../hooks/useProjects'
import { useTranslation } from 'react-i18next'
import { resolveMediaUrl } from '../lib/media'

export default function ProjectCard({ project }: { project: Project }) {
    const { t } = useTranslation()
    const imageUrl = project.image_url
        ? resolveMediaUrl(project.image_url, {
            transformations: ['c_fill', 'w_1200', 'h_750', 'f_auto', 'q_auto'],
        })
        : ''

    return (
        <article className="overflow-hidden rounded-lg border bg-white p-4">
            {imageUrl && (
                <div className="mb-4 overflow-hidden rounded-lg border border-black/5 bg-black/5">
                    <img
                        src={imageUrl}
                        alt={project.title}
                        className="h-44 w-full object-cover"
                        loading="lazy"
                    />
                </div>
            )}
            <h3 className="text-lg font-medium mb-1">{project.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
                {project.tech_stack?.map((t) => (
                    <span key={t} className="text-xs px-2 py-1 bg-gray-100 rounded">{t}</span>
                ))}
            </div>
            <div className="flex gap-3 text-sm">
                {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noreferrer" className="text-blue-600">{t('projectCard.github')}</a>
                )}
                {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noreferrer" className="text-blue-600">{t('projectCard.live')}</a>
                )}
            </div>
        </article>
    )
}
