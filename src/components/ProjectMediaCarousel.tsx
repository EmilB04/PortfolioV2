import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react'
import { resolveMediaUrl } from '../lib/media'
import BrowserPreview from './BrowserPreview'

type MediaItem =
    | { type: 'live'; url: string }
    | { type: 'image' | 'video'; src: string }

type Props = {
    images: string[]
    videos: string[]
    title: string
    liveUrl?: string | null
}

export default function ProjectMediaCarousel({ images, videos, title, liveUrl }: Props) {
    const items: MediaItem[] = [
        ...(liveUrl ? [{ type: 'live' as const, url: liveUrl }] : []),
        ...(images ?? []).map((src) => ({ type: 'image' as const, src })),
        ...(videos ?? []).map((src) => ({ type: 'video' as const, src })),
    ]
    const [index, setIndex] = useState(0)
    const [lightbox, setLightbox] = useState(false)

    const prev = useCallback(() => setIndex((i) => (i - 1 + items.length) % items.length), [items.length])
    const next = useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length])

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (!lightbox) return
            if (e.key === 'ArrowLeft') prev()
            if (e.key === 'ArrowRight') next()
            if (e.key === 'Escape') setLightbox(false)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [lightbox, prev, next])

    if (items.length === 0) return null

    const current = items[index]
    const isLive = current.type === 'live'
    const isVid = current.type === 'video'
    const resolved = isLive ? null : resolveMediaUrl((current as { type: 'image' | 'video'; src: string }).src)

    return (
        <div>
            {/* Main frame */}
            <div className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                {isLive ? (
                    <BrowserPreview url={(current as { type: 'live'; url: string }).url} />
                ) : (
                    <div className="aspect-video w-full">
                        {isVid ? (
                            <video src={resolved ?? undefined} controls className="h-full w-full object-contain" />
                        ) : (
                            <img
                                src={resolved ?? undefined}
                                alt={`${title} ${index + 1}`}
                                className="h-full w-full object-contain"
                                loading="lazy"
                            />
                        )}
                    </div>
                )}

                {!isLive && !isVid && (
                    <button
                        type="button"
                        onClick={() => setLightbox(true)}
                        className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Fullscreen"
                    >
                        <Maximize2 size={13} />
                    </button>
                )}

                {items.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={prev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </>
                )}
            </div>

            {/* Dots + counter */}
            {items.length > 1 && (
                <div className="mt-3 flex items-center justify-center gap-3">
                    <div className="flex gap-1.5">
                        {items.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setIndex(i)}
                                className={`h-1.5 rounded-full transition-all duration-200 ${
                                    i === index
                                        ? 'w-4 bg-[var(--accent)]'
                                        : 'w-1.5 bg-[var(--border)] hover:bg-[var(--text-subtle)]'
                                }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-[var(--text-subtle)]">
                        {index + 1} / {items.length}
                    </span>
                </div>
            )}

            {/* Thumbnails */}
            {items.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {items.map((item, i) => {
                        const thumbSrc = item.type === 'live'
                            ? null
                            : resolveMediaUrl(item.src, { transformations: ['w_120,h_80,c_fill,q_70'] })
                        return (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setIndex(i)}
                                className={`flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-150 ${
                                    i === index
                                        ? 'border-[var(--accent)]'
                                        : 'border-transparent opacity-50 hover:opacity-80'
                                }`}
                            >
                                {item.type === 'live' ? (
                                    <div className="flex h-[50px] w-[80px] items-center justify-center bg-[var(--surface-card)] text-sm font-medium text-[var(--accent)]">
                                        Live
                                    </div>
                                ) : item.type === 'video' ? (
                                    <div className="flex h-[50px] w-[80px] items-center justify-center bg-[var(--surface-card)] text-sm text-[var(--text-subtle)]">
                                        Video
                                    </div>
                                ) : (
                                    <img src={thumbSrc!} alt="" className="block h-[50px] w-[80px] object-cover" loading="lazy" />
                                )}
                            </button>
                        )
                    })}
                </div>
            )}

            {/* Lightbox */}
            {lightbox && !isLive && !isVid && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
                    onClick={() => setLightbox(false)}
                >
                    <button
                        type="button"
                        onClick={() => setLightbox(false)}
                        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                    {items.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); prev() }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); next() }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                    {resolved && (
                        <img
                            src={resolved}
                            alt={`${title} ${index + 1}`}
                            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}
                </div>
            )}
        </div>
    )
}
