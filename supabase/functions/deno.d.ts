// Editor-only shims. These functions run on Deno in Supabase Edge Functions, but the repo
// has no Deno toolchain installed, so VS Code type-checks them with the bundled TypeScript
// service — which knows nothing about the Deno global or about remote/jsr: imports.
//
// Nothing here affects the deployed code: `supabase functions deploy` (and the Supabase MCP
// deploy) send the source to the Deno runtime, which supplies the real types. This file only
// exists so the editor stops reporting "Cannot find name 'Deno'" on valid code.

declare namespace Deno {
    export const env: {
        get(key: string): string | undefined
    }

    export function serve(
        handler: (req: Request) => Response | Promise<Response>,
    ): unknown
}

// Remote and jsr: specifiers are resolved by Deno at deploy time, not by tsc.
declare module 'jsr:*'
declare module 'https://*'

// cloudinary-sign imports serve() from the std library; typing it keeps the request
// parameter from falling back to an implicit any.
declare module 'https://deno.land/std@0.168.0/http/server.ts' {
    export function serve(
        handler: (req: Request) => Response | Promise<Response>,
    ): void
}
