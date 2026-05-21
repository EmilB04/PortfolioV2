import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

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
