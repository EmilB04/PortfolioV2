// Verify the actual production artifacts, including routes discovered from data.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = join(dirname(fileURLToPath(import.meta.url)), '../dist')
const read = path => readFileSync(join(dist, path), 'utf8')
const decode = value => value.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
const jsonScript = (html, id) => JSON.parse(html.match(new RegExp(`<script id="${id}" type="application/(?:ld\\+)?json">([\\s\\S]*?)</script>`))?.[1] ?? 'null')
const projects = jsonScript(read('index.html'), 'project-data')
assert.ok(Array.isArray(projects) && projects.length > 0, 'Home page must bootstrap public projects')
const paths = ['/', '/projects', '/contact', ...projects.map(project => `/projects/${project.local_path}`)]
const titles = new Set()

for (const path of [...paths, '/404']) {
    const html = read(path === '/' ? 'index.html' : `${path.slice(1)}.html`)
    assert.match(html, /<html lang="nb">/, `${path}: Norwegian document language`)
    assert.equal((html.match(/<title>/g) ?? []).length, 1, `${path}: one title`)
    assert.equal((html.match(/name="description"/g) ?? []).length, 1, `${path}: one description`)
    assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1, `${path}: one canonical`)
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${path}: one primary heading`)
    assert.ok(!html.includes('data-msg=') && !html.includes('data-dgst='), `${path}: no failed SSR boundaries`)
    assert.ok(!html.includes('<!--$?-->') && !html.includes('id="S:'), `${path}: content must not require streaming scripts`)
    assert.ok(html.includes(`data-ssr-path="${path}"`), `${path}: matching hydration route`)
    const title = decode(html.match(/<title>([^<]+)<\/title>/)?.[1] ?? '')
    const description = decode(html.match(/<meta name="description"\s+content="([^"]+)"/)?.[1] ?? '')
    assert.ok(title.includes('Emil Berglund') && !titles.has(title), `${path}: distinct title with author`)
    titles.add(title)
    assert.ok(description.length >= 30 && description.length <= 170, `${path}: useful description`)
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
    assert.equal(canonical, `https://emilb.no${path}`, `${path}: stable canonical`)
    const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1]
    assert.equal(robots, path === '/404' ? 'noindex,follow' : 'index,follow,max-image-preview:large', `${path}: indexing policy`)
    assert.equal(html.match(/<meta property="og:title" content="([^"]+)"/)?.[1], html.match(/<title>([^<]+)<\/title>/)?.[1])
    assert.ok(html.includes('content="https://emilb.no/icons/EB_LOGO-512.png"'), `${path}: Portal share logo`)
    const graph = jsonScript(html, 'structured-data')['@graph']
    const page = graph.find(item => item['@id'] === `${canonical}#webpage`)
    assert.equal(page.name, title, `${path}: schema title agrees with HTML`)
    assert.equal(page.description, description, `${path}: schema description agrees with HTML`)
    assert.equal(page.url, canonical, `${path}: schema URL agrees with HTML`)
    assert.equal(page.inLanguage, 'nb-NO', `${path}: schema language`)
    if (path.startsWith('/projects/')) {
        const project = projects.find(item => path === `/projects/${item.local_path}`)
        assert.equal(decode(html.match(/<h1\b[^>]*>(.*?)<\/h1>/)?.[1] ?? ''), project.title)
        const text = project.translations?.no?.description || project.description
        assert.ok(html.includes(text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;')), `${path}: public description is in rendered content`)
        assert.ok(graph.some(item => item['@type'] === 'CreativeWork'), `${path}: project identity`)
        assert.ok(graph.some(item => item['@type'] === 'BreadcrumbList'), `${path}: breadcrumbs`)
    }
}
const sitemapPaths = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname)
assert.deepEqual(sitemapPaths.sort(), [...paths].sort(), 'Sitemap must cover exactly the public indexable pages')
const overview = read('projects.html')
for (const project of projects) assert.ok(overview.includes(`href="/projects/${project.local_path}"`), `${project.local_path}: crawlable link in overview`)
assert.match(read('robots.txt'), /Sitemap: https:\/\/emilb\.no\/sitemap\.xml/)
assert.ok(!read('_redirects').includes('/*    /index.html'), 'Missing URLs must not be rewritten to the home page')
console.log(`SEO checks passed: ${paths.length} indexable pages, project content, metadata, structured data, sitemap and 404.`)
