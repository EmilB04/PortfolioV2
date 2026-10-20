import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
    ArrowRight,
    Code2,
    Zap,
    Smartphone,
    Users,
    Layout,
    BatteryFull,
    FolderOpen,
    Eye,
    FileText,
    Lightbulb,
    Gamepad2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLocalizedProject } from '../hooks/useProjects'
import type { Project } from '../hooks/useProjects'
import { ROUTES } from '../routes/routes'

export type ProjectView = 'grid' | 'list'

const PROJECT_ICONS: Record<string, LucideIcon> = {
    spillarena: Gamepad2,
    lumabridge: Lightbulb,
    pageprobe: Code2,
    varsel: Zap,
    chorechamp: Smartphone,
    skillswap: Users,
    'portfolio-website': Layout,
    perceivo: Eye,
    'readme-generator': FileText,
    'streamdeck-battery-monitor': BatteryFull,
}

export default function ProjectCard({ project: sourceProject, view = 'grid' }: { project: Project; view?: ProjectView }) {
    const { t } = useTranslation()
    const project = useLocalizedProject(sourceProject)
    const Icon = PROJECT_ICONS[project.local_path] ?? FolderOpen

    return (
        <Link
            to={ROUTES.PROJECT_DETAILS.path.replace(':projectId', project.local_path)}
            className={`card-organic project-card project-card--${view}`}
        >
            <div className="project-card__heading">
                <span className="project-card__icon">
                    <Icon size={20} aria-hidden="true" />
                </span>
                <h2 className="project-card__title">{project.title}</h2>
            </div>

            <p className="project-card__description">
                {project.description}
            </p>

            {project.languages?.length > 0 && (
                <div className="project-card__stack">
                    {project.languages.map((lang) => (
                        <span key={lang}>
                            {lang}
                        </span>
                    ))}
                </div>
            )}

            <span className="project-card__action">
                <span className="project-card__action-label">{t('projectCard.readMore')}</span>
                <ArrowRight size={14} aria-hidden="true" />
            </span>
        </Link>
    )
}
