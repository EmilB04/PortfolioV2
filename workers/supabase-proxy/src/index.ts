/**
 * Supabase proxy — keeps the site's data calls first-party.
 *
 * Calling <project>.supabase.co directly from the browser makes Supabase's own
 * Cloudflare edge set a `__cf_bm` cookie on the visitor, before they have
 * answered the cookie banner. Routing the same calls through this Worker on the
 * site's own domain removes that: the visitor only ever talks to this origin,
 * inbound cookies are never forwarded upstream, and any `Set-Cookie` the
 * upstream returns is dropped before the response reaches the browser.
 *
 * Deploy it on a route of the site's own domain (see wrangler.toml) and point
 * VITE_SUPABASE_URL at that route.
 */

export interface Env {
    /** Upstream project, e.g. https://abcdefgh.supabase.co */
    SUPABASE_URL: string
    /** Path the Worker is mounted on and strips before forwarding. */
    PATH_PREFIX?: string
}

/** Headers that belong to a single connection and must not be relayed. */
const HOP_BY_HOP = [
    'connection',
    'keep-alive',
    'proxy-authenticate',
    'proxy-authorization',
    'te',
    'trailer',
    'transfer-encoding',
    'upgrade',
]

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        if (!env.SUPABASE_URL) {
            return new Response('SUPABASE_URL is not configured', { status: 500 })
        }

        const upstreamBase = new URL(env.SUPABASE_URL)
        const incoming = new URL(request.url)
        const prefix = env.PATH_PREFIX ?? '/api/supabase'

        if (!incoming.pathname.startsWith(prefix)) {
            return new Response('Not found', { status: 404 })
        }

        const path = incoming.pathname.slice(prefix.length) || '/'
        const target = new URL(path + incoming.search, upstreamBase)

        const headers = new Headers(request.headers)
        // The visitor's cookies are theirs; upstream has no business seeing them.
        headers.delete('cookie')
        HOP_BY_HOP.forEach((header) => headers.delete(header))
        headers.delete('host')

        const upstream = await fetch(target.toString(), {
            method: request.method,
            headers,
            body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
            redirect: 'manual',
        })

        const responseHeaders = new Headers(upstream.headers)
        // The one line this Worker exists for.
        responseHeaders.delete('set-cookie')
        HOP_BY_HOP.forEach((header) => responseHeaders.delete(header))

        return new Response(upstream.body, {
            status: upstream.status,
            statusText: upstream.statusText,
            headers: responseHeaders,
        })
    },
}
