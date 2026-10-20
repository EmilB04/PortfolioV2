import { ExternalLink, Lock } from 'lucide-react'
import SitePreviewImage from './SitePreviewImage'

type Props = {
    url: string
    imageUrl?: string
    placeholderUrl?: string
}

export default function BrowserPreview({ url, imageUrl, placeholderUrl }: Props) {
    const hostname = (() => {
        try { return new URL(url).hostname } catch { return url }
    })()

    return (
        <div
            className="pebble w-full overflow-hidden"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15), 0 0 0 1px var(--border)' }}
        >
            {/* Chrome bar */}
            <div className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-3 py-2">
                <div className="flex shrink-0 gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                </div>
                <div className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[var(--surface-card)] px-3 py-1 text-sm text-[var(--text-subtle)]">
                    <Lock size={10} className="opacity-50" aria-hidden="true" />
                    {hostname}
                </div>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded p-1 text-[var(--text-subtle)] transition-colors hover:text-[var(--text)]"
                    aria-label="Open in new tab"
                >
                    <ExternalLink size={13} aria-hidden="true" />
                </a>
            </div>

            {/* Preview */}
            <div className="relative aspect-video w-full overflow-hidden bg-[var(--surface)]">
                <SitePreviewImage
                    url={url}
                    imageUrl={imageUrl}
                    placeholderUrl={placeholderUrl}
                    alt={`${hostname} preview`}
                    className="block h-full w-full object-cover object-top"
                />
            </div>
        </div>
    )
}
