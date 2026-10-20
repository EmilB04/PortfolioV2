# SEO for emilb.no

`src/lib/seo.ts` defines Norwegian titles, descriptions and structured data.
The prerender script imports them from the SSR bundle; client navigation uses
the same source. Run `npm run build` for production. `build:client-only` does
not generate the crawlable page content or route-specific metadata.

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
The sitemap covers `/`, `/projects` and `/contact`. Individual project pages
still load their database content in the browser.

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
[site names](https://developers.google.com/search/docs/appearance/site-names).
