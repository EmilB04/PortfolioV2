import { useProjects } from '../hooks/useProjects'
import ProjectCard from '../components/ProjectCard'
import { useTranslation } from 'react-i18next'

export default function Projects() {
    const { t } = useTranslation()
    const { projects, loading } = useProjects()

    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold mb-4">{t('projectsPage.title')}</h2>
            {loading ? (
                <p>{t('projectsPage.loading')}</p>
            ) : projects.length === 0 ? (
                <p>{t('projectsPage.empty')}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {projects.map((p) => (
                        <ProjectCard key={p.id} project={p} />
                    ))}
                </div>
            )}
        </main>
    )
}
