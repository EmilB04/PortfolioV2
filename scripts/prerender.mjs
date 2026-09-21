// Runs after the client build and the `--ssr` build. Renders each static
// route to a string with the SSR bundle, then bakes that markup plus its own
// <title>/meta tags into a copy of the built index.html at the matching
// path — so a crawler (or anyone with JS off) gets real content on first
// byte instead of an empty <div id="root">.
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const distDir = join(root, 'dist')
const ssrDir = join(root, 'dist-server')

const ROUTES = [
    { path: '/', out: 'index.html' },
    { path: '/projects', out: 'projects/index.html' },
    { path: '/contact', out: 'contact/index.html' },
]

// Kept in sync with src/lib/seo.ts by hand — this script runs on plain Node
// against build output, so it can't import the TS module directly.
const SEO = {
    '/': {
        title: 'Emil Berglund - Full-Stack Developer & Computer Science Student in Halden, Norway',
        description:
            'Emil Berglund is a full-stack developer and computer science student in Halden, Norway, building with React, TypeScript, .NET and Python. Portfolio with projects, experience and skills.',
    },
    '/projects': {
        title: 'Projects - Emil Berglund',
        description:
            'Software projects built by Emil Berglund, full-stack developer in Halden, Norway — web apps, tools and experiments using React, TypeScript, .NET and Python.',
    },
    '/contact': {
        title: 'Contact - Emil Berglund',
        description: 'Get in touch with Emil Berglund, full-stack developer and computer science student in Halden, Norway.',
    },
}

function escapeAttr(value) {
    return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

function escapeHtml(value) {
    return escapeAttr(value).replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function setTagContent(html, tagRegex, attr, value) {
    return html.replace(tagRegex, (tag) => tag.replace(new RegExp(`${attr}="[^"]*"`), `${attr}="${escapeAttr(value)}"`))
}

function buildPage(template, route, appHtml) {
    const { title, description } = SEO[route.path]
    const canonical = route.path === '/' ? 'https://emilb.no/' : `https://emilb.no${route.path}`

    let html = template
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
    html = setTagContent(html, /<meta\s+name="description"[^>]*>/, 'content', description)
    html = setTagContent(html, /<meta\s+property="og:title"[^>]*>/, 'content', title)
    html = setTagContent(html, /<meta\s+property="og:description"[^>]*>/, 'content', description)
    html = setTagContent(html, /<meta\s+property="og:url"[^>]*>/, 'content', canonical)
    html = setTagContent(html, /<meta\s+name="twitter:title"[^>]*>/, 'content', title)
    html = setTagContent(html, /<meta\s+name="twitter:description"[^>]*>/, 'content', description)
    html = setTagContent(html, /<link\s+rel="canonical"[^>]*>/, 'href', canonical)
    html = html.replace(
        '<div id="root"></div>',
        `<div id="root" data-ssr-path="${escapeAttr(route.path)}">${appHtml}</div>`,
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

    const { render } = await import(pathToFileURL(ssrEntry).href)
    const template = readFileSync(join(distDir, 'index.html'), 'utf-8')

    for (const route of ROUTES) {
        const appHtml = render(route.path)
        const page = buildPage(template, route, appHtml)
        const outPath = join(distDir, route.out)
        mkdirSync(dirname(outPath), { recursive: true })
        writeFileSync(outPath, page)
        console.log(`prerendered ${route.path} -> dist/${route.out}`)
    }

    rmSync(ssrDir, { recursive: true, force: true })
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
