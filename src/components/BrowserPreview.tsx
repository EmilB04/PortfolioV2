import { useState } from 'react'
import { ExternalLink, Lock } from 'lucide-react'

type Props = {
    url: string
    imageUrl?: string
}

export default function BrowserPreview({ url, imageUrl }: Props) {
    const [screenshotFailed, setScreenshotFailed] = useState(false)

    const hostname = (() => {
        try { return new URL(url).hostname } catch { return url }
    })()

    const microlinkSrc = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`
    const src = imageUrl ?? (screenshotFailed ? null : microlinkSrc)

    return (
        <div
            className="w-full overflow-hidden rounded-xl"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15), 0 0 0 1px var(--border)' }}
        >
            {/* Chrome bar */}
            <div className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-3 py-2">
                <div className="flex flex-shrink-0 gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                </div>
                <div className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[var(--surface-card)] px-3 py-1 text-[11px] text-[var(--text-subtle)]">
                    <Lock size={10} className="opacity-50" />
                    {hostname}
                </div>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 rounded p-1 text-[var(--text-subtle)] transition-colors hover:text-[var(--text)]"
                    aria-label="Open in new tab"
                >
                    <ExternalLink size={13} />
                </a>
            </div>

            {/* Preview */}
            <div className="aspect-video w-full overflow-hidden bg-[var(--surface)]">
                {src ? (
                    <img
                        src={src}
                        alt={`${hostname} preview`}
                        onError={() => setScreenshotFailed(true)}
                        className="block h-full w-full object-cover object-top"
                        loading="lazy"
                    />
                ) : (
                    <div
                        className="flex h-full w-full items-center justify-center"
                        style={{ background: 'color-mix(in srgb, var(--accent) 6%, var(--surface))' }}
                    >
                        <span className="text-xs text-[var(--text-subtle)]">{hostname}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
