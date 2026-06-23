import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
export type CourseTypes = {
    semester: string
    courses: { name: string; link: string; code: string; description: string }[]
}

export type Course = {
    id: number
    semester_id: number
    name: string
    link: string
    code: string
    description: string
}

type SupabaseCourseRow = {
    id: number
    semester_id: number
    name: string | null
    link: string | null
    code: string | null
    description: string | null
}

type SupabaseSemesterRow = {
    id: number
    semester: string
    courses: SupabaseCourseRow[] | null
}

type SemesterWithCourses = {
    id: number
    semester: string
    courses: Course[]
}

type UseCoursesResult = {
    data: Course[]
    loading: boolean
    error: string | null
    refetch: () => Promise<void>
}

function mapCourse(row: SupabaseCourseRow): Course {
    return {
        id: row.id,
        semester_id: row.semester_id,
        name: row.name ?? '',
        link: row.link ?? '',
        code: row.code ?? '',
        description: row.description ?? '',
    }
}

function mapSemester(row: SupabaseSemesterRow): CourseTypes {
    return {
        semester: row.semester,
        courses: (row.courses ?? []).map((course) => ({
            name: course.name ?? '',
            link: course.link ?? '',
            code: course.code ?? '',
            description: course.description ?? '',
        })),
    }
}

export async function fetchCoursesOnce(): Promise<SemesterWithCourses[]> {
    const { data, error } = await supabase
        .from('semesters')
        .select('id, semester, courses(id, semester_id, name, link, code, description)')
        .order('id', { ascending: true })

    if (error) {
        throw new Error(error.message)
    }

    return ((data ?? []) as SupabaseSemesterRow[]).map((row) => ({
        id: row.id,
        semester: row.semester,
        courses: (row.courses ?? []).map(mapCourse),
    }))
}

export async function fetchCourseWithId(semesterId: number): Promise<CourseTypes | null> {
    const { data, error } = await supabase
        .from('semesters')
        .select('id, semester, courses(id, semester_id, name, link, code, description)')
        .eq('id', semesterId)
        .maybeSingle()

    if (error) {
        throw new Error(error.message)
    }

    if (!data) return null

    return mapSemester(data as SupabaseSemesterRow)
}

export async function fetchCoursesBySemester(semesterId: number): Promise<Course[]> {
    const { data, error } = await supabase
        .from('courses')
        .select('id, semester_id, name, link, code, description')
        .eq('semester_id', semesterId)
        .order('id', { ascending: true })

    if (error) throw new Error(error.message)
    return ((data ?? []) as SupabaseCourseRow[]).map(mapCourse)
}

export default function useCourses(semesterId?: number): UseCoursesResult {
    const [data, setData] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
        setLoading(true)
        setError(null)

        let query = supabase
            .from('courses')
            .select('id, semester_id, name, link, code, description')
            .order('id', { ascending: true })

        if (typeof semesterId === 'number') {
            query = query.eq('semester_id', semesterId)
        }

        const { data, error } = await query

        if (error) {
            setError(error.message)
            setData([])
            setLoading(false)
            return
        }

        setData(((data ?? []) as SupabaseCourseRow[]).map(mapCourse))
        setLoading(false)
    }

    useEffect(() => {
        queueMicrotask(() => {
            void fetchData()
        })
    }, [semesterId])

    return { data, loading, error, refetch: fetchData }
}