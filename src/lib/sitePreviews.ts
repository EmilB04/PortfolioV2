import previews from '../data/site-previews.json'

const storedPreviews: Record<string, string> = previews

export function getStoredPreview(source: string): string | undefined {
    try {
        const url = new URL(source)
        return storedPreviews[`${url.origin}${url.pathname.replace(/\/+$/, '')}${url.search}`]
    } catch {
        return undefined
    }
}

export function getPreviewSources(url: string, imageUrl?: string, placeholderUrl?: string): string[] {
    const stored = [imageUrl, getStoredPreview(url), placeholderUrl].filter((source): source is string => Boolean(source))
    if (stored.length) return [...new Set(stored)]

    // Only sites without a saved image need a third-party browser capture.
    const params = new URLSearchParams({
        url,
        screenshot: 'true',
        meta: 'false',
        embed: 'screenshot.url',
        adblock: 'true',
        'viewport.width': '1200',
        'viewport.height': '750',
    })
    return [`https://api.microlink.io/?${params}`]
}
