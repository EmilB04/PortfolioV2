import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface Project {
    id: string
    title: string
    description: string
    tech_stack: string[]
    github_url?: string
    live_url?: string
    image_url?: string
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
                    .order('created_at', { ascending: false })

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
