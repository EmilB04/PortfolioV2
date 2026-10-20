import { createContext } from 'react'
import type { Project } from '../lib/projects'

/** Public build-time data, reused by the browser for its first render. */
export const ProjectDataContext = createContext<Project[] | undefined>(undefined)

export function readPrerenderedProjects(): Project[] | undefined {
    const data = document.getElementById('project-data')?.textContent
    if (!data) return undefined
    try {
        const projects: unknown = JSON.parse(data)
        return Array.isArray(projects) ? projects as Project[] : undefined
    } catch {
        return undefined
    }
}
