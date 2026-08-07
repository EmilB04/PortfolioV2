import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-key',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Constant-time compare so the response time can't be used to recover the key byte by byte.
function secretsMatch(provided: string, expected: string): boolean {
    const a = new TextEncoder().encode(provided)
    const b = new TextEncoder().encode(expected)
    if (a.length !== b.length) return false

    let diff = 0
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
    return diff === 0
}

serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

    const json = (data: unknown, status = 200) =>
        new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

    const adminSecret = Deno.env.get('ADMIN_UPLOAD_SECRET')
    const providedKey = req.headers.get('x-admin-key')
    if (!adminSecret || !providedKey || !secretsMatch(providedKey, adminSecret)) {
        return json({ error: 'Unauthorized' }, 401)
    }

    let body: {
        action?: 'sign' | 'save'
        folder?: string
        publicId?: string
        timestamp?: number
        localPath?: string
        newPublicIds?: string[]
        currentImages?: string[]
    }

    try {
        body = await req.json()
    } catch {
        return json({ error: 'Invalid JSON' }, 400)
    }

    // --- action: save ---
    if (body.action === 'save') {
        const { localPath, newPublicIds, currentImages } = body
        if (!localPath || !newPublicIds?.length) return json({ error: 'Missing localPath or newPublicIds' }, 400)

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
        )

        const updatedImages = [...(currentImages ?? []), ...newPublicIds]
        const { error } = await supabase
            .from('projects')
            .update({ images: updatedImages })
            .eq('local_path', localPath)

        if (error) return json({ error: error.message }, 500)
        return json({ ok: true, images: updatedImages })
    }

    // --- action: sign (default) ---
    const { folder, publicId, timestamp } = body
    if (!folder || !publicId || !timestamp) return json({ error: 'Missing sign params' }, 400)

    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET')
    if (!apiSecret) return json({ error: 'Missing CLOUDINARY_API_SECRET' }, 500)

    const paramsString = [
        `folder=${folder}`,
        `public_id=${publicId}`,
        `timestamp=${timestamp}`,
    ].sort().join('&')

    const hashBuffer = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(paramsString + apiSecret))
    const signature = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

    return json({ signature })
})
