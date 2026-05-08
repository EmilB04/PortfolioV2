import React from 'react'
import type { Project } from '../hooks/useProjects'

export default function ProjectCard({ project }: { project: Project }) {
    return (
        <article className="border rounded-lg p-4 bg-white">
            <h3 className="text-lg font-medium mb-1">{project.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
                {project.tech_stack?.map((t) => (
                    <span key={t} className="text-xs px-2 py-1 bg-gray-100 rounded">{t}</span>
                ))}
            </div>
            <div className="flex gap-3 text-sm">
                {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noreferrer" className="text-blue-600">GitHub</a>
                )}
                {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noreferrer" className="text-blue-600">Live</a>
                )}
            </div>
        </article>
    )
}
