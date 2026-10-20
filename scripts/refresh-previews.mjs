import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, rename, unlink, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { loadProjects } from './load-projects.mjs'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const manifestPath = join(root, 'src/data/site-previews.json')
const outputDir = join(root, 'public/previews')
const viewport = { width: 1200, height: 750 }
const selected = new Set(process.argv.slice(2))

function previewKey(source) {
    const url = new URL(source)
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error(`Unsupported preview URL: ${source}`)
    return `${url.origin}${url.pathname.replace(/\/+$/, '')}${url.search}`
}

const targets = new Map([
    ['https://spillarena.no', { slug: 'spillarena', url: 'https://spillarena.no/' }],
    ['https://tools.emilb.no', { slug: 'tools', url: 'https://tools.emilb.no/' }],
])
for (const project of await loadProjects(root)) {
    if (project.live_url) targets.set(previewKey(project.live_url), { slug: project.local_path, url: project.live_url })
}
for (const slug of selected) {
    if (![...targets.values()].some(target => target.slug === slug)) throw new Error(`Unknown preview: ${slug}`)
}

let manifest = {}
try { manifest = JSON.parse(await readFile(manifestPath, 'utf8')) } catch (error) {
    if (error.code !== 'ENOENT') throw error
}
await mkdir(outputDir, { recursive: true })
await mkdir(dirname(manifestPath), { recursive: true })

const browser = await chromium.launch({
    ...(process.env.PREVIEW_BROWSER_EXECUTABLE_PATH ? { executablePath: process.env.PREVIEW_BROWSER_EXECUTABLE_PATH } : {}),
})

async function capture(key, target) {
    const context = await browser.newContext({ viewport, locale: 'nb-NO', colorScheme: 'light', reducedMotion: 'reduce' })
    try {
        // This disposable browser stores only a refusal; it never uses a visitor's session.
        await context.addCookies([{ name: 'cookie-consent', value: 'declined', url: new URL(target.url).origin }])
        await context.addInitScript(() => {
            localStorage.setItem('cookie-consent', 'declined')
            sessionStorage.setItem('spillarena-consent-reminder-seen', '1')
        })
        await context.route('**/*', route => {
            const host = new URL(route.request().url()).hostname
            return /(^|\.)(googlesyndication\.com|doubleclick\.net|googleadservices\.com|googletagmanager\.com|google-analytics\.com|fundingchoicesmessages\.google\.com)$/.test(host)
                ? route.abort()
                : route.continue()
        })
        const page = await context.newPage()
        const response = await page.goto(target.url, { waitUntil: 'commit', timeout: 30000 })
        if (!response?.ok()) throw new Error(`HTTP ${response?.status() ?? 'no response'}`)
        await page.locator('h1, h2, main, [role="main"]').filter({ visible: true }).first().waitFor({ timeout: 20000 })
        await page.waitForFunction(() => document.body.innerText.trim().length > 100, undefined, { timeout: 20000 })
        await page.evaluate(() => Promise.race([
            document.fonts.ready,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Fonts did not load')), 10000)),
        ]))
        await page.waitForTimeout(1200)
        if (target.slug === 'varsel') {
            await page.waitForFunction(() => ![...document.querySelectorAll('.animate-pulse, .q-skeleton, [aria-busy="true"]')]
                .some(element => element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })), undefined, { timeout: 90000 })
            await page.getByText('Starter backend-tjenesten', { exact: false }).waitFor({ state: 'hidden', timeout: 90000 })
            if (await page.getByText('Kunne ikke laste priser', { exact: false }).isVisible()) {
                throw new Error('Price service is unavailable; keeping the previous capture')
            }
        }

        // A custom consent implementation may use a different storage key.
        const decline = page.getByRole('button', { name: /^(decline|reject all|avslå|avvis alle)$/i })
        for (const button of await decline.all()) {
            if (await button.evaluate(element => element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }))) {
                await button.click({ timeout: 3000 })
                await page.waitForTimeout(400)
                break
            }
        }
        const consentDialogs = page.locator('[role="dialog"], dialog[open]').filter({ hasText: /cookie|consent|privacy|personvern|informasjonskapsler|save your progress/i })
        const blocked = await consentDialogs.evaluateAll(dialogs => dialogs.some(element => element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })))
        if (blocked) throw new Error('Consent dialog is still visible; keeping the previous capture')

        // Wait for visible artwork, without waiting on analytics or below-fold widgets.
        await page.waitForFunction(() => [...document.images].filter(image => {
            const box = image.getBoundingClientRect()
            return box.width > 0 && box.height > 0 && box.top < innerHeight && box.bottom > 0
        }).every(image => image.complete), undefined, { timeout: 10000 })
        const bytes = await page.screenshot({ type: 'jpeg', quality: 80, animations: 'disabled', caret: 'hide' })
        const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 10)
        const filename = `${target.slug}.${hash}.jpg`
        await writeFile(join(outputDir, filename), bytes)
        manifest[key] = `/previews/${filename}`
        console.log(`${target.slug}: ${(bytes.length / 1024).toFixed(0)} KB, ${manifest[key]}`)
    } finally {
        await context.close()
    }
}

try {
    // Two captures at a time keeps refreshes from competing for every site resource.
    const queue = [...targets].filter(([, target]) => selected.size === 0 || selected.has(target.slug))
    async function worker() {
        while (queue.length) {
            const [key, target] = queue.shift()
            try { await capture(key, target) } catch (error) {
                console.error(`${target.slug}: ${error.message}`)
                process.exitCode = 1
            }
        }
    }
    await Promise.all([worker(), worker()])
    await writeFile(`${manifestPath}.tmp`, `${JSON.stringify(manifest, null, 2)}\n`)
    await rename(`${manifestPath}.tmp`, manifestPath)
    const referenced = new Set(Object.values(manifest).map(source => source.split('/').pop()))
    for (const filename of await readdir(outputDir)) {
        if (/^[a-z0-9-]+\.[a-f0-9]{10}\.jpg$/.test(filename) && !referenced.has(filename)) {
            await unlink(join(outputDir, filename))
        }
    }
} finally {
    await browser.close()
}
