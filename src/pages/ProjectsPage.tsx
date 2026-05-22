import { useProjects } from '../hooks/useProjects'
import ProjectCard from '../components/ProjectCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useTranslation } from 'react-i18next'

export default function Projects() {
    const { t } = useTranslation()
    const { projects, loading } = useProjects()

    return (
        <main className="min-h-screen px-4 py-12" style={{ color: 'var(--text)' }}>
            <div className="mx-auto max-w-6xl">
                <header className="mb-12 text-center">
                    <h1
                        className="text-3xl font-semibold sm:text-4xl"
                        style={{ background: 'transparent', color: 'var(--accent)' }}
                    >
                        {t('projectsPage.title')}
                    </h1>
                    <p className="mt-3 text-sm text-[var(--text-muted)] sm:text-base">
                        {t('projectsPage.subtitle')}
                    </p>
                </header>

                {loading ? (
                    <LoadingSpinner />
                ) : projects.length === 0 ? (
                    <p className="text-center text-sm text-[var(--text-muted)]">{t('projectsPage.empty')}</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {projects.map((p) => (
                            <div key={p.id} className="w-full">
                                <ProjectCard project={p} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main >
    )
}

