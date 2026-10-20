// Runs after the client build and the `--ssr` build. Renders each static
// route to a string with the SSR bundle, then bakes that markup plus its own
// <title>/meta tags into a copy of the built index.html at the matching
// path — so a crawler (or anyone with JS off) gets real content on first
// byte instead of an empty <div id="root">.
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadProjects } from './load-projects.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const distDir = join(root, 'dist')
const ssrDir = join(root, 'dist-server')

const ROUTES = [
    { path: '/', out: 'index.html' },
    { path: '/projects', out: 'projects.html' },
    { path: '/contact', out: 'contact.html' },
]

function escapeAttr(value) {
    return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

function escapeHtml(value) {
    return escapeAttr(value).replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function setTagContent(html, tagRegex, attr, value) {
    return html.replace(tagRegex, (tag) => tag.replace(new RegExp(`${attr}="[^"]*"`), () => `${attr}="${escapeAttr(value)}"`))
}

function buildPage(template, route, appHtml, seo, canonicalFor, structuredDataFor, projects) {
    const { title, description } = seo
    const canonical = canonicalFor(route.path)

    let html = template
    html = html.replace(/<title>[^<]*<\/title>/, () => `<title>${escapeHtml(title)}</title>`)
    html = setTagContent(html, /<meta\s+name="description"[^>]*>/, 'content', description)
    html = setTagContent(html, /<meta\s+property="og:title"[^>]*>/, 'content', title)
    html = setTagContent(html, /<meta\s+property="og:description"[^>]*>/, 'content', description)
    html = setTagContent(html, /<meta\s+property="og:url"[^>]*>/, 'content', canonical)
    html = setTagContent(html, /<meta\s+name="twitter:title"[^>]*>/, 'content', title)
    html = setTagContent(html, /<meta\s+name="twitter:description"[^>]*>/, 'content', description)
    html = setTagContent(html, /<link\s+rel="canonical"[^>]*>/, 'href', canonical)
    html = setTagContent(html, /<meta\s+name="robots"[^>]*>/, 'content', seo.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large')
    const structuredData = JSON.stringify(structuredDataFor(route.path, title, description, projects)).replace(/</g, '\\u003c')
    html = html.replace(
        /(<script\s+id="structured-data"\s+type="application\/ld\+json">)[\s\S]*?(<\/script>)/,
        (_match, start, end) => `${start}${structuredData}${end}`,
    )
    html = html.replace('<!--project-data-->', () => `<script id="project-data" type="application/json">${JSON.stringify(projects).replace(/</g, '\\u003c')}</script>`)
    html = html.replace(
        '<div id="root"></div>',
        () => `<div id="root" data-ssr-path="${escapeAttr(route.path)}">${appHtml}</div>`,
    )
    return html
}

async function main() {
    if (!existsSync(join(distDir, 'index.html'))) {
        throw new Error('dist/index.html not found — run `vite build` before prerendering.')
    }
    const ssrEntry = join(ssrDir, 'entry-server.js')
    if (!existsSync(ssrEntry)) {
        throw new Error('dist-server/entry-server.js not found — run the --ssr build before prerendering.')
    }

    const { render, routeSeo, notFoundSeo, canonicalFor, structuredDataFor, projectSeoFor } = await import(pathToFileURL(ssrEntry).href)
    const template = readFileSync(join(distDir, 'index.html'), 'utf-8')
    const projects = await loadProjects(root)
    const projectRoutes = projects.map(project => ({
        path: `/projects/${project.local_path}`,
        out: `projects/${project.local_path}.html`,
        seo: projectSeoFor(project),
    }))
    const routes = [
        ...ROUTES.map(route => ({ ...route, seo: routeSeo[route.path] })),
        ...projectRoutes,
        { path: '/404', out: '404.html', seo: notFoundSeo },
    ]

    for (const route of routes) {
        const appHtml = await render(route.path, projects)
        const page = buildPage(template, route, appHtml, route.seo, canonicalFor, structuredDataFor, projects)
        const outPath = join(distDir, route.out)
        mkdirSync(dirname(outPath), { recursive: true })
        writeFileSync(outPath, page)
        console.log(`prerendered ${route.path} -> dist/${route.out}`)
    }

    const sitemap = readFileSync(join(root, 'public/sitemap.xml'), 'utf-8').replace(
        '</urlset>',
        `${projectRoutes.map(route => `  <url><loc>${escapeHtml(canonicalFor(route.path))}</loc></url>`).join('\n')}\n</urlset>`,
    )
    writeFileSync(join(distDir, 'sitemap.xml'), sitemap)
    console.log(`sitemap: ${ROUTES.length + projectRoutes.length} public pages`)

    rmSync(ssrDir, { recursive: true, force: true })
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
