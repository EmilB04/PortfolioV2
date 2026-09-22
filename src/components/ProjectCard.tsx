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
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLocalizedProject } from '../hooks/useProjects'
import type { Project } from '../hooks/useProjects'
import { ROUTES } from '../routes/routes'

const PROJECT_ICONS: Record<string, LucideIcon> = {
    pageprobe: Code2,
    varsel: Zap,
    chorechamp: Smartphone,
    skillswap: Users,
    'portfolio-website': Layout,
    perceivo: Eye,
    'readme-generator': FileText,
    'streamdeck-battery-monitor': BatteryFull,
}

export default function ProjectCard({ project: sourceProject }: { project: Project }) {
    const { t } = useTranslation()
    const project = useLocalizedProject(sourceProject)
    const Icon = PROJECT_ICONS[project.local_path] ?? FolderOpen

    return (
        <Link
            to={ROUTES.PROJECT_DETAILS.path.replace(':projectId', project.local_path)}
            className="card-organic group flex h-full flex-col items-start gap-4 p-6 text-left hover:-translate-y-1"
        >
            <div
                className="pebble-sm p-3"
                style={{ background: 'color-mix(in srgb, var(--accent) 13%, transparent)' }}
            >
                <Icon size={26} style={{ color: 'var(--accent-text)' }} aria-hidden="true" />
            </div>

            <h2 className="m-0 text-lg font-semibold text-[var(--text)]">{project.title}</h2>

            <p className="prose-organic flex-1 text-[15px] leading-relaxed text-[var(--text-muted)]">
                {project.description}
            </p>

            {project.languages?.length > 0 && (
                <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                    {project.languages.map((lang) => (
                        <span key={lang} className="text-[13px] text-[var(--text-subtle)]">
                            {lang}
                        </span>
                    ))}
                </div>
            )}

            <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-text)]">
                {t('projectCard.readMore')}
                <ArrowRight size={14} aria-hidden="true" />
            </span>
        </Link>
    )
}
