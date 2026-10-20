import { useState } from 'react'
import { LayoutGrid, List } from 'lucide-react'
import { useProjects } from '../hooks/useProjects'
import ProjectCard from '../components/ProjectCard'
import type { ProjectView } from '../components/ProjectCard'
import { ProjectCardSkeleton } from '../components/ui/Skeleton'
import { useTranslation } from 'react-i18next'
import { useSeo } from '../hooks/useSeo'
import { ROUTE_SEO } from '../lib/seo'
import PageHeader from '../components/ui/PageHeader'
import PageLayout from '../components/ui/PageLayout'

// Preserve the choice when returning from a project, without storing device data.
let sessionView: ProjectView = 'grid'

export default function Projects() {
    const { t } = useTranslation()
    const { projects, loading } = useProjects()
    const [view, setView] = useState<ProjectView>(sessionView)
    useSeo(ROUTE_SEO['/projects'].title, ROUTE_SEO['/projects'].description, '/projects')

    function changeView(nextView: ProjectView) {
        sessionView = nextView
        setView(nextView)
    }

    return (
        <PageLayout>
            <PageHeader>
                <h1 className="m-0 max-w-[18ch]">{t('projectsPage.title')}</h1>
                <p className="prose-organic max-w-[54ch] text-[var(--text-muted)]">
                    {t('projectsPage.subtitle')}
                </p>
            </PageHeader>

            <div className="projects-toolbar">
                <span className="projects-toolbar__count" role="status">
                    {loading ? t('projectsPage.loading') : t('projectsPage.count', { count: projects.length })}
                </span>
                <div className="project-view-switch" role="group" aria-label={t('projectsPage.viewLabel')}>
                    <button
                        type="button"
                        aria-pressed={view === 'grid'}
                        onClick={() => changeView('grid')}
                    >
                        <LayoutGrid size={16} aria-hidden="true" />
                        {t('projectsPage.gridView')}
                    </button>
                    <button
                        type="button"
                        aria-pressed={view === 'list'}
                        onClick={() => changeView('list')}
                    >
                        <List size={16} aria-hidden="true" />
                        {t('projectsPage.listView')}
                    </button>
                </div>
            </div>

            {!loading && projects.length === 0 ? (
                <p className="text-[15px] text-[var(--text-muted)]">{t('projectsPage.empty')}</p>
            ) : (
                <ul className={`projects-results projects-results--${view}`} aria-busy={loading}>
                    {loading ? Array.from({ length: 6 }, (_, i) => (
                        <li key={i} aria-hidden="true"><ProjectCardSkeleton view={view} /></li>
                    )) : projects.map((p) => (
                        <li key={p.id}><ProjectCard project={p} view={view} /></li>
                    ))}
                </ul>
            )}
        </PageLayout>
    )
}

