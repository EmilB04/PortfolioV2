import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ExternalLink, Github, Upload, X, Check, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Project } from '../hooks/useProjects'
import { ProjectDetailSkeleton } from '../components/ui/Skeleton'
import ProjectMediaCarousel from '../components/ProjectMediaCarousel'

const CLOUD_NAME = import.meta.env.CLOUDINARY_CLOUD_NAME ?? 'emilber-portfolio'
const API_KEY = import.meta.env.CLOUDINARY_API_KEY ?? ''
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''
const ADMIN_KEY_SESSION_STORAGE_KEY = 'portfolio_admin_upload_key'

function readStoredAdminKey(): string | null {
    try {
        return sessionStorage.getItem(ADMIN_KEY_SESSION_STORAGE_KEY)
    } catch {
        return null
    }
}

function storeAdminKey(key: string) {
    try {
        sessionStorage.setItem(ADMIN_KEY_SESSION_STORAGE_KEY, key)
    } catch {
        // sessionStorage unavailable (private browsing, quota) — key just won't persist across reloads
    }
}

async function getSignature(folder: string, publicId: string, timestamp: number, adminKey: string) {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/cloudinary-sign`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            'x-admin-key': adminKey,
        },
        body: JSON.stringify({ folder, publicId, timestamp }),
    })
    if (!res.ok) throw new Error(`Sign failed: ${res.status}`)
    const { signature } = await res.json() as { signature: string }
    return signature
}

async function uploadToCloudinary(file: File, folder: string, publicId: string, adminKey: string): Promise<string> {
    const timestamp = Math.floor(Date.now() / 1000)
    const signature = await getSignature(folder, publicId, timestamp, adminKey)

    const form = new FormData()
    form.append('file', file)
    form.append('api_key', API_KEY)
    form.append('timestamp', String(timestamp))
    form.append('signature', signature)
    form.append('folder', folder)
    form.append('public_id', publicId)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: form,
    })
    const data = await res.json() as { public_id: string }
    return data.public_id
}

export default function SpesificProjectPage() {
    const { projectId } = useParams<{ projectId: string }>()
    const { t } = useTranslation()
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [devMode, setDevMode] = useState(false)
    const [adminKey, setAdminKey] = useState<string | null>(readStoredAdminKey)
    const [uploading, setUploading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        let mounted = true
            ; (async () => {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('local_path', projectId)
                    .single()

                if (!mounted) return
                if (error || !data) {
                    setNotFound(true)
                } else {
                    setProject(data as Project)
                }
                setLoading(false)
            })()
        return () => { mounted = false }
    }, [projectId])

    // CTRL+SHIFT+D toggles dev mode
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault()
                setDevMode((v) => {
                    const next = !v
                    if (next && !adminKey) {
                        // Dev-only convenience — never present in a `vite build` bundle, see .env.example
                        const devSecret = import.meta.env.DEV ? import.meta.env.VITE_DEV_ADMIN_UPLOAD_SECRET : undefined
                        const entered = devSecret || window.prompt('Admin upload secret:')
                        if (entered) {
                            setAdminKey(entered)
                            storeAdminKey(entered)
                        }
                    }
                    return next
                })
                setUploadStatus('idle')
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [adminKey])

    async function handleUpload(files: FileList | null) {
        if (!files || !project || !adminKey) return
        setUploading(true)
        setUploadStatus('idle')

        const folder = `portfolio/projects/${project.local_path}`
        const newPublicIds: string[] = []

        try {
            for (const file of Array.from(files)) {
                const publicId = `${project.local_path}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
                const publicIdFull = await uploadToCloudinary(file, folder, publicId, adminKey)
                newPublicIds.push(publicIdFull)
            }

            const res = await fetch(`${SUPABASE_URL}/functions/v1/cloudinary-sign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    apikey: SUPABASE_ANON_KEY,
                    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                    'x-admin-key': adminKey,
                },
                body: JSON.stringify({
                    action: 'save',
                    localPath: project.local_path,
                    newPublicIds,
                    currentImages: project.images ?? [],
                }),
            })
            const result = await res.json() as { ok?: boolean; images?: string[]; error?: string }
            if (!result.ok) throw new Error(result.error ?? 'Save failed')

            setProject({ ...project, images: result.images! })
            setUploadStatus('success')
        } catch {
            setUploadStatus('error')
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    if (loading) {
        return (
            <div className="px-4 py-12" style={{ marginTop: '4rem', color: 'var(--text)' }}>
                <ProjectDetailSkeleton />
            </div>
        )
    }

    if (notFound || !project) {
        return (
            <div className="flex flex-col items-center justify-center gap-4" style={{ minHeight: 'calc(100vh - 4rem)', marginTop: '4rem', color: 'var(--text)' }}>
                <p className="text-[var(--text-muted)]">{t('projectDetails.notFound')}</p>
            </div>
        )
    }

    return (
        <div className="px-4 py-12" style={{ marginTop: '4rem', color: 'var(--text)' }}>
            <div className="mx-auto max-w-screen-xl backdrop-blur-xl">
                {/* Title + live badge — centered, large */}
                <div className="mb-4 flex flex-wrap items-center justify-center gap-3 text-center">
                    <h2 className="w-full text-5xl font-bold text-[var(--accent-text)] sm:text-6xl">{project.title}</h2>
                    {project.live_url && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800 dark:bg-green-500/15 dark:text-green-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400" aria-hidden="true" />
                            {t('projectCard.live')}
                        </span>
                    )}
                </div>

                {/* Tech stack — below title */}
                {project.languages?.length > 0 && (
                    <div className="mb-8 flex flex-col items-center gap-2">
                        <span className="text-sm font-semibold uppercase tracking-widest text-[var(--text-subtle)]">
                            {t('projectDetails.stack')}
                        </span>
                        <div className="flex flex-wrap justify-center gap-1.5">
                            {project.languages.map((lang) => (
                                <span
                                    key={lang}
                                    className="rounded-full bg-[color:color-mix(in_srgb,var(--accent)_10%,transparent)] px-2.5 py-0.5 text-xs font-medium text-[var(--accent-text)]"
                                >
                                    {lang}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_220px]">
                    {/* Main content */}
                    <div className="flex flex-col gap-6">
                        <p className="text-base font-medium leading-relaxed text-[var(--text)]">
                            {project.description}
                        </p>

                        {project.details && (
                            <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--text-muted)]">
                                {project.details}
                            </p>
                        )}

                        {/* Media carousel */}
                        <ProjectMediaCarousel
                            images={project.images ?? []}
                            videos={project.videos ?? []}
                            title={project.title}
                            liveUrl={project.live_url}
                        />

                        {/* Tags — bottom */}
                        {project.tags?.length > 0 && (
                            <div className="flex flex-col gap-2 pt-2">
                                <span className="text-sm font-semibold uppercase tracking-widest text-[var(--text-subtle)]">
                                    {t('projectDetails.tags')}
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs font-medium text-[var(--text-muted)]"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            {project.url && (
                                <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-text)]"
                                >
                                    <Github size={15} aria-hidden="true" />
                                    {t('projectCard.sourceCode')}
                                </a>
                            )}
                            {project.live_url && (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
                                >
                                    <ExternalLink size={15} aria-hidden="true" />
                                    {t('projectsSection.visitSite')}
                                </a>
                            )}
                        </div>
                    </aside>
                </div>
            </div>

            {/* Dev mode indicator */}
            {devMode && (
                <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-3 py-1.5 text-xs font-semibold text-yellow-400 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-400" />
                    DEV MODE
                </div>
            )}

            {/* Dev upload panel */}
            {devMode && (
                <div className="fixed bottom-14 right-4 z-40 w-72 rounded-2xl border border-[var(--border)] bg-[var(--surface-card)] p-4 shadow-xl backdrop-blur-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wider">
                            Upload media — {project.local_path}
                        </span>
                        <button
                            type="button"
                            onClick={() => setDevMode(false)}
                            aria-label="Close dev panel"
                            className="rounded p-0.5 text-[var(--text-subtle)] hover:text-[var(--text)]"
                        >
                            <X size={14} aria-hidden="true" />
                        </button>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) => handleUpload(e.target.files)}
                    />

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading || !adminKey}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--border)] px-4 py-5 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-text)] disabled:pointer-events-none disabled:opacity-50"
                    >
                        {uploading ? (
                            <><Loader2 size={16} className="animate-spin" /> Uploading…</>
                        ) : (
                            <><Upload size={16} /> Choose files</>
                        )}
                    </button>

                    {uploadStatus === 'success' && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-green-400">
                            <Check size={12} /> Uploaded + saved to Supabase
                        </p>
                    )}
                    {uploadStatus === 'error' && (
                        <p className="mt-2 text-xs text-red-400">Upload failed. Check console.</p>
                    )}

                    <p className="mt-3 text-sm text-[var(--text-subtle)]">
                        Uploads to <code className="text-[var(--accent-text)]">portfolio/projects/{project.local_path}/</code>
                    </p>
                </div>
            )}
        </div>
    )
}
