import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import IndexLayout from './_layout'
import ProjectCard from '../ProjectCard'
import { supabase } from '../../lib/supabase'
import type { Project } from '../../hooks/useProjects'
import { INDEX_PATHS } from '../../routes/indexPaths'
import { ROUTES } from '../../routes/routes'

export default function ProjectsSection() {
    const { t } = useTranslation()
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        ;(async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('id', { ascending: true })
                .limit(2)

            if (error) {
                console.error(error)
            } else if (mounted && data) {
                setProjects(data as Project[])
            }
            if (mounted) setLoading(false)
        })()

        return () => {
            mounted = false
        }
    }, [])

    return (
        <IndexLayout id={INDEX_PATHS.PROJECTS} className="flex-col">
            <header className="mb-10 w-full text-center">
                <h2 className="text-3xl font-semibold sm:text-4xl">{t('projectsSection.title')}</h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
                    {t('projectsSection.intro')}
                </p>
            </header>

            {loading ? (
                <p className="text-center text-sm text-[var(--text-muted)]">{t('projectsPage.loading')}</p>
            ) : (
                <div className="grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}

            <div className="mt-10 flex justify-center">
                <Link
                    to={ROUTES.PROJECTS.path}
                    className="rounded-full border border-[var(--accent)] px-6 py-2.5 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-white"
                >
                    {t('projectsSection.cta')}
                </Link>
            </div>
        </IndexLayout>
    )
}
