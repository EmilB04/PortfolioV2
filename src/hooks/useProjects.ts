import { useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useLanguage } from './useLanguage'
import { ProjectDataContext } from '../context/projectDataContext'
import { localizeProject } from '../lib/projects'
import type { Project } from '../lib/projects'

export type { Project } from '../lib/projects'

/** Project in the language the page is currently shown in. */
export function useLocalizedProject<T extends Project | null | undefined>(project: T): T {
    const { current } = useLanguage()
    return (project ? localizeProject(project, current) : project) as T
}

export function useProjects() {
    const initialProjects = useContext(ProjectDataContext)
    const [projects, setProjects] = useState<Project[]>(initialProjects ?? [])
    const [loading, setLoading] = useState(initialProjects === undefined)

    useEffect(() => {
        let mounted = true
            ; (async () => {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .order('id', { ascending: true })

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

    return { projects, loading }
}

/** Keep the current slug isolated from previous requests and upload updates. */
export function useProject(slug: string | undefined) {
    const initialProject = useContext(ProjectDataContext)?.find(project => project.local_path === slug)
    const [result, setResult] = useState<{
        slug: string | undefined
        project: Project | null
        notFound: boolean
        error: boolean
    }>()
    const current = result?.slug === slug ? result : undefined

    useEffect(() => {
        let mounted = true
        void (async () => {
            const { data, error } = await supabase.from('projects').select('*').eq('local_path', slug).maybeSingle()
            if (!mounted) return
            if (error) console.error(error)
            setResult({
                slug,
                project: error ? initialProject ?? null : data as Project | null,
                notFound: !error && !data,
                error: Boolean(error),
            })
        })()
        return () => { mounted = false }
    }, [slug, initialProject])

    return {
        project: current ? current.project : initialProject ?? null,
        loading: !current && !initialProject,
        notFound: current?.notFound ?? false,
        error: current?.error ?? false,
        setProject: (project: Project) => setResult({ slug, project, notFound: false, error: false }),
    }
}
