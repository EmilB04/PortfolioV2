# Supabase proxy Worker

Keeps the site's data calls first-party.

## Why

`https://<project>.supabase.co` sits behind Supabase's own Cloudflare edge,
which answers every REST call with `Set-Cookie: __cf_bm=…`. That is a cookie
placed on the visitor's device before they have answered the cookie banner.
The app cannot prevent it from the browser side — only stop talking to that
host directly.

This Worker runs on `emilb.no/api/supabase/*`, forwards the request to the
Supabase project, and:

- never forwards the visitor's `Cookie` header upstream,
- strips `Set-Cookie` from the upstream response.

The browser then only ever talks to `emilb.no`, and no cookie is set.

## Deploy

```sh
cd workers/supabase-proxy
npx wrangler deploy
```

The route in `wrangler.toml` assumes the `emilb.no` zone is on the same
Cloudflare account. Check the value of `SUPABASE_URL` there before deploying.

## Point the app at it

Set the build-time env var for the production build:

```
VITE_SUPABASE_URL=https://emilb.no/api/supabase
```

`VITE_SUPABASE_ANON_KEY` stays unchanged — the key is still sent by the browser
and still enforced by Supabase's row-level security. Local development can keep
pointing straight at `https://<project>.supabase.co`.

## Verify

```sh
curl -sSI "https://emilb.no/api/supabase/rest/v1/projects?select=id" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" | grep -i set-cookie
```

No output means no cookie reaches the browser.
