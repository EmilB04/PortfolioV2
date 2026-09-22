import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useLanguage } from './useLanguage'
import type { LanguageCode } from './useLanguage'

type ProjectText = Partial<Pick<Project, 'description' | 'details'>>

export interface Project {
    id: number
    title: string
    languages: string[]
    description: string
    details: string
    local_path: string
    url: string
    live_url: string | null
    images: string[]
    videos: string[]
    tags: string[]
    /** Non-English text by language code; `description` / `details` above are English. */
    translations?: Partial<Record<LanguageCode, ProjectText>> | null
}

/** The project with its text in `lang`, falling back to English field by field. */
export function localizeProject(project: Project, lang: LanguageCode): Project {
    const text = project.translations?.[lang]
    if (!text) return project
    return {
        ...project,
        description: text.description || project.description,
        details: text.details || project.details,
    }
}

/** Project in the language the page is currently shown in. */
export function useLocalizedProject<T extends Project | null | undefined>(project: T): T {
    const { current } = useLanguage()
    return (project ? localizeProject(project, current) : project) as T
}

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
            ; (async () => {
                setLoading(true)
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .order('id', { ascending: true })

                if (error) {
                    console.error(error)
                } else if (mounted && data) {
                    setProjects(data as Project[])
                }
                setLoading(false)
            })()

        return () => {
            mounted = false
        }
    }, [])

    return { projects, loading }
}
