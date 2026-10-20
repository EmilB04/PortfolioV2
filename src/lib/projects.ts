import type { LanguageCode } from '../hooks/useLanguage'

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
    translations?: Partial<Record<LanguageCode, ProjectText>> | null
}

/** Use translated fields when available, with the public English copy as fallback. */
export function localizeProject(project: Project, lang: LanguageCode): Project {
    const text = project.translations?.[lang]
    if (!text) return project
    return {
        ...project,
        description: text.description || project.description,
        details: text.details || project.details,
    }
}
