import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { CourseTypes } from '../data/courseList'

type SupabaseCourse = {
    name: string | null
    link: string | null
    code: string | null
    description: string | null
}

type SupabaseSemesterRow = {
    id: number
    semester: string
    courses?: SupabaseCourse[] | null
}

export default function useCourses() {
    const [data, setData] = useState<CourseTypes[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let mounted = true

        const fetchData = async () => {
            try {

                const { data, error } = await supabase
                    .from('semesters')
                    .select('id, semester, courses(name, link, code, description)')
                    .order('id', { ascending: true })

                if (!mounted) return
                if (error) {
                    setError(error.message)
                    return
                }

                const rows = (data ?? []) as SupabaseSemesterRow[]

                const mapped: CourseTypes[] = rows.map((row) => ({
                    semester: row.semester,
                    courses: (row.courses ?? []).map((c) => ({
                        name: c.name ?? '',
                        link: c.link ?? '',
                        code: c.code ?? '',
                        description: c.description ?? '',
                    })),
                }))

                setData(mapped)
            } catch (err) {
                if (!mounted) return
                setError((err as Error).message)
            } finally {
                if (!mounted) return
                setLoading(false)
            }
        }

        void fetchData()

        return () => {
            mounted = false
        }
    }, [])

    return { data, loading, error }
}

export async function fetchCoursesOnce(): Promise<CourseTypes[]> {
    const { data, error } = await supabase
        .from('semesters')
        .select('id, semester, courses(name, link, code, description)')
        .order('id', { ascending: true })

    if (error) throw error

    const rows = (data ?? []) as SupabaseSemesterRow[]

    return rows.map((row) => ({
        semester: row.semester,
        courses: (row.courses ?? []).map((c) => ({
            name: c.name ?? '',
            link: c.link ?? '',
            code: c.code ?? '',
            description: c.description ?? '',
        })),
    })) as CourseTypes[]
}
