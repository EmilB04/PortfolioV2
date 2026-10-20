import { useState } from 'react'
import { getPreviewSources } from '../lib/sitePreviews'

type Props = {
    url: string
    alt: string
    imageUrl?: string
    placeholderUrl?: string
    className?: string
    loading?: 'eager' | 'lazy'
}

export default function SitePreviewImage({ url, alt, imageUrl, placeholderUrl, className = '', loading = 'lazy' }: Props) {
    const [failed, setFailed] = useState<string[]>([])
    const src = getPreviewSources(url, imageUrl, placeholderUrl).find(source => !failed.includes(source))

    if (!src) {
        return <div className={`flex items-center justify-center bg-[var(--surface)] p-4 text-center text-sm text-[var(--text-subtle)] ${className}`}>{alt}</div>
    }

    return (
        <img
            key={src}
            src={src}
            alt={alt}
            width={1200}
            height={750}
            decoding="async"
            loading={loading}
            onError={() => setFailed(previous => [...previous, src])}
            className={className}
        />
    )
}
