# SEO for emilb.no

`src/lib/seo.ts` defines Norwegian titles, descriptions and structured data.
The prerender script imports them from the SSR bundle; client navigation uses
the same source. Run `npm run build` for production. It also runs the artifact
checks in `scripts/check-seo.mjs`; rerun these with `npm run seo:check`.
`build:client-only` is for development and does not generate crawlable project
pages, route-specific metadata or the production 404 page.

The public URL defaults to Norwegian Bokmål, even in English browsers, so
Google sees Norwegian before and after rendering JavaScript. Visitors can
still select another language and save that preference after cookie consent.

The fixed icons in `public/icons/EB_LOGO-*.png` are copied from Portfolio
Portal. They supply search branding, share previews and the Apple touch icon.
`public/favicon.ico` provides the conventional fallback URL. The existing
theme-specific favicon declarations, header logos and `public/brand/eb-*`
assets retain their current appearance and theme behavior.

The generated home page identifies Emil Berglund with `Person`, `WebSite`
and `ProfilePage` structured data, including GitHub and LinkedIn references.
The project overview uses `CollectionPage` and an `ItemList`; contact uses
`ContactPage`. Project details have a distinct title, a concise translated
description, their own canonical URL, `CreativeWork` data and breadcrumbs.

## Project content and URLs

The production build reads the public projects with `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY`. It selects only public display fields and fails if
the API fails, the result is unexpectedly empty or slugs are invalid or
duplicated. No administrative key is needed.

That snapshot provides the initial HTML for the home page, project overview
and every `/projects/<slug>` page. It is embedded as escaped JSON for the
browser's initial render. The browser still refreshes data from the public
API; an API outage preserves the initial project content.

The generated `dist/sitemap.xml` combines the three static URLs from
`public/sitemap.xml` with every project URL. With the current ten projects,
there are 13 indexable pages. Project entries omit `lastmod` because the
public data does not provide a reliable modification timestamp.

Rebuild and deploy after adding, removing or substantially editing projects
so the static pages, metadata and sitemap stay current.

Pages are emitted as `projects.html`, `contact.html` and
`projects/<slug>.html` so Cloudflare Pages serves the extensionless canonical
URLs without trailing slashes. Old slash URLs permanently redirect to the
canonical versions. All project links are present in the overview's initial
HTML, including when JavaScript is disabled.

Unknown URLs use the generated `404.html` with HTTP 404 and `noindex`.
Client navigation also sets `noindex` for confirmed missing pages and clears
it when navigating to a valid page. Do not restore the old wildcard rewrite
to `/index.html`; it returned the home page with status 200 for missing URLs.

## After publishing

1. In Google Search Console, inspect `https://emilb.no/`, run the live URL
   test and request indexing. Confirm the rendered page is Norwegian and
   references the fixed Portal icon.
2. Submit or check `https://emilb.no/sitemap.xml`. Its `lastmod` values should
   reflect real page changes; do not replace them on every deployment.
3. Monitor indexing, impressions and clicks for the query `Emil Berglund`.
   Keep the name and website URL consistent on the linked public profiles.

Google chooses the final title, snippet, favicon and ranking. The metadata
expresses the preferred presentation; it cannot guarantee first position.
Recrawling an updated favicon can take several days to several weeks.

References: [Google favicon guidelines](https://developers.google.com/search/docs/appearance/favicon-in-search),
[snippets](https://developers.google.com/search/docs/appearance/snippet),
[site names](https://developers.google.com/search/docs/appearance/site-names),
[JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics),
[Cloudflare Pages routing](https://developers.cloudflare.com/pages/configuration/serving-pages/).
