import { useEffect } from 'react'
import { canonicalFor } from '../lib/seo'

function setMeta(selector: string, attr: 'content' | 'href', value: string) {
    const el = document.head.querySelector(selector)
    if (el) el.setAttribute(attr, value)
}

/**
 * Client-side route nav never reloads index.html, so the prerendered
 * <title>/meta baked in at build time only ever matches the very first
 * page a visitor lands on. This keeps them in sync after that — same job
 * the prerender script does for the initial HTML, just for the SPA leg.
 */
export function useSeo(title: string, description: string, path: string) {
    useEffect(() => {
        const canonical = canonicalFor(path)
        document.title = title
        setMeta('meta[name="description"]', 'content', description)
        setMeta('meta[property="og:title"]', 'content', title)
        setMeta('meta[property="og:description"]', 'content', description)
        setMeta('meta[property="og:url"]', 'content', canonical)
        setMeta('meta[name="twitter:title"]', 'content', title)
        setMeta('meta[name="twitter:description"]', 'content', description)
        setMeta('link[rel="canonical"]', 'href', canonical)
    }, [title, description, path])
}
