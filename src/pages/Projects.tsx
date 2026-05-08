import React from 'react'
import { useProjects } from '../hooks/useProjects'
import ProjectCard from '../components/ProjectCard'

export default function Projects() {
    const { projects, loading } = useProjects()

    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold mb-4">Projects</h2>
            {loading ? (
                <p>Loading…</p>
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
