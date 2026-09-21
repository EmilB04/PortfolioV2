import { useProjects } from '../hooks/useProjects'
import ProjectCard from '../components/ProjectCard'
import { ProjectCardSkeleton } from '../components/ui/Skeleton'
import { useTranslation } from 'react-i18next'
import { useSeo } from '../hooks/useSeo'
import { ROUTE_SEO } from '../lib/seo'

export default function Projects() {
    const { t } = useTranslation()
    const { projects, loading } = useProjects()
    useSeo(ROUTE_SEO['/projects'].title, ROUTE_SEO['/projects'].description, '/projects')

    return (
        <div className="min-h-screen px-5 pb-16 pt-28 md:px-10" style={{ color: 'var(--text)' }}>
            <div className="mx-auto max-w-screen-xl">
                <header className="mb-14 flex flex-col gap-4">
                    <h1 className="m-0 max-w-[18ch]">{t('projectsPage.title')}</h1>
                    <p className="prose-organic max-w-[54ch] text-[var(--text-muted)]">
                        {t('projectsPage.subtitle')}
                    </p>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <ProjectCardSkeleton key={i} />
                        ))}
                    </div>
                ) : projects.length === 0 ? (
                    <p className="text-[15px] text-[var(--text-muted)]">{t('projectsPage.empty')}</p>
                ) : (
                    <div className="pebble-set grid grid-cols-1 gap-6 md:grid-cols-2 min-[1280px]:grid-cols-3">
                        {projects.map((p) => (
                            <ProjectCard key={p.id} project={p} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

