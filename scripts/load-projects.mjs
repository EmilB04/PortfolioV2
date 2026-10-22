import { loadEnv } from 'vite'

/** Read the same public fields used by the site, with the anonymous key only. */
export async function loadProjects(root) {
    const env = { ...loadEnv('production', root, ''), ...process.env }
    // Build-time reads can bypass the site's own /api/supabase proxy, which
    // may not be deployed yet (first deploy, or a previous deploy that failed).
    const baseUrl = env.PRERENDER_SUPABASE_URL || env.VITE_SUPABASE_URL
    if (!baseUrl || !env.VITE_SUPABASE_ANON_KEY) {
        throw new Error('Prerendering requires VITE_SUPABASE_ANON_KEY and PRERENDER_SUPABASE_URL (or VITE_SUPABASE_URL).')
    }
    const url = new URL(`${baseUrl.replace(/\/$/, '')}/rest/v1/projects`)
    const fields = ['id', 'title', 'languages', 'description', 'details', 'local_path', 'url', 'live_url', 'images', 'videos', 'tags', 'translations']
    url.searchParams.set('select', fields.join(','))
    url.searchParams.set('order', 'id.asc')
    const response = await fetch(url, {
        headers: {
            apikey: env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${env.VITE_SUPABASE_ANON_KEY}`,
        },
        signal: AbortSignal.timeout(20000),
    })
    if (!response.ok) throw new Error(`Cannot load public projects (HTTP ${response.status}); refusing to publish incomplete pages.`)
    const rows = await response.json()
    if (!Array.isArray(rows) || rows.length === 0) throw new Error('No public projects returned; check the public read policy before building.')
    const slugs = new Set()
    return rows.map(row => {
        if (typeof row.local_path !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.local_path) || slugs.has(row.local_path)) {
            throw new Error('Public projects contain an invalid or duplicate URL slug.')
        }
        if (typeof row.title !== 'string' || !row.title.trim() || typeof row.description !== 'string') {
            throw new Error(`Project ${row.local_path} has no valid public title or description.`)
        }
        slugs.add(row.local_path)
        // An explicit allowlist prevents future private columns entering HTML.
        return Object.fromEntries(fields.map(field => [field, row[field]]))
    })
}
