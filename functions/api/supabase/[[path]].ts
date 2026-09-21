/**
 * First-party Supabase proxy, deployed with the site as a Cloudflare Pages
 * Function on /api/supabase/*.
 *
 * Calling <project>.supabase.co straight from the browser makes Supabase's own
 * Cloudflare edge set a `__cf_bm` cookie on the visitor before they have
 * answered the cookie banner. Routing the calls through this origin removes
 * that: visitor cookies are never forwarded upstream, and `Set-Cookie` is
 * stripped from every upstream response.
 *
 * Set SUPABASE_UPSTREAM in the Pages project's environment variables, and
 * point VITE_SUPABASE_URL at https://<domain>/api/supabase.
 *
 * `workers/supabase-proxy/` holds the same proxy as a standalone Worker, for
 * hosting that is not Cloudflare Pages.
 */

interface Env {
    /** Upstream project, e.g. https://abcdefgh.supabase.co */
    SUPABASE_UPSTREAM?: string
}

const PREFIX = '/api/supabase'

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

export const onRequest: (context: {
    request: Request
    env: Env
}) => Promise<Response> = async ({ request, env }) => {
    const upstreamBase = env.SUPABASE_UPSTREAM
    if (!upstreamBase) {
        return new Response('SUPABASE_UPSTREAM is not configured', { status: 500 })
    }

    const incoming = new URL(request.url)
    const path = incoming.pathname.startsWith(PREFIX)
        ? incoming.pathname.slice(PREFIX.length) || '/'
        : incoming.pathname
    const target = new URL(path + incoming.search, upstreamBase)

    const headers = new Headers(request.headers)
    // The visitor's cookies are theirs; upstream has no business seeing them.
    headers.delete('cookie')
    headers.delete('host')
    HOP_BY_HOP.forEach((header) => headers.delete(header))

    const upstream = await fetch(target.toString(), {
        method: request.method,
        headers,
        body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
        redirect: 'manual',
    })

    const responseHeaders = new Headers(upstream.headers)
    // The one line this function exists for.
    responseHeaders.delete('set-cookie')
    HOP_BY_HOP.forEach((header) => responseHeaders.delete(header))

    return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: responseHeaders,
    })
}
