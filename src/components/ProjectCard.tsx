import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
    ArrowRight,
    Code2,
    Zap,
    Smartphone,
    Users,
    Layout,
    Gamepad2,
    Anchor,
    FolderOpen,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Project } from '../hooks/useProjects'
import { ROUTES } from '../routes/routes'

const PROJECT_ICONS: Record<string, LucideIcon> = {
    pageprobe: Code2,
    varsel: Zap,
    chorechamp: Smartphone,
    skillswap: Users,
    'portfolio-website': Layout,
    hangbot: Gamepad2,
    fleetbot: Anchor,
}

export default function ProjectCard({ project }: { project: Project }) {
    const { t } = useTranslation()
    const Icon = PROJECT_ICONS[project.local_path] ?? FolderOpen

    return (
        <Link
            to={ROUTES.PROJECT_DETAILS.path.replace(':projectId', project.local_path)}
            className="group flex h-full flex-col items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-lg active:scale-[0.98]"
        >
            <div
                className="rounded-xl p-3 transition-transform duration-200 group-hover:scale-110"
                style={{ background: 'color-mix(in srgb, var(--accent) 15%, transparent)' }}
            >
                <Icon size={32} style={{ color: 'var(--accent)' }} />
            </div>

            <h3 className="text-lg font-bold text-[var(--text)]">{project.title}</h3>

            <p className="flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
                {project.description}
            </p>

            {project.languages?.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5">
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

            <span className="mt-auto inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-black transition-transform duration-200 group-hover:scale-105 active:scale-95"
                style={{ background: 'var(--accent)' }}
            >
                {t('projectCard.readMore')}
                <ArrowRight size={14} />
            </span>
        </Link>
    )
}
