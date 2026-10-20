import { StrictMode, Suspense } from 'react'
import { renderToReadableStream } from 'react-dom/server'
import { StaticRouter, Routes, Route } from 'react-router-dom'
import './lib/i18n'
import Layout from './components/_layout'
import ErrorBoundary from './components/ErrorBoundary'
import { ThemeProvider } from './context/ThemeProvider'
import { AccentProvider } from './context/AccentProvider'
import { CookieConsentProvider } from './context/CookieConsentProvider'
import Home from './pages/HomePage'
import ContactPage from './pages/ContactPage'
import ProjectsPage from './pages/ProjectsPage'
import CookieConsentBanner from './components/CookieConsentBanner'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Expose the shared metadata through the SSR bundle for plain Node prerendering.
export { ROUTE_SEO as routeSeo, canonicalFor, structuredDataFor } from './lib/seo'

// Only the routes worth a real crawl get a server entry here: the ones with
// static, translated copy (no Supabase/GitHub fetch on first paint). The
// project-detail route stays client-only — its content is per-project data
// that only exists after a network round trip, so prerendering it would just
// bake in a skeleton.
export async function render(url: string) {
    const stream = await renderToReadableStream(
        <StrictMode>
            <CookieConsentProvider>
                <ThemeProvider>
                    <AccentProvider>
                        <StaticRouter location={url}>
                            <ErrorBoundary>
                                <Layout>
                                    <Suspense fallback={<LoadingSpinner />}>
                                        <Routes>
                                            <Route path="/" element={<Home />} />
                                            <Route path="/contact" element={<ContactPage />} />
                                            <Route path="/projects" element={<ProjectsPage />} />
                                        </Routes>
                                    </Suspense>
                                </Layout>
                            </ErrorBoundary>
                        </StaticRouter>
                        <CookieConsentBanner />
                    </AccentProvider>
                </ThemeProvider>
            </CookieConsentProvider>
        </StrictMode>,
    )
    // Finish lazy boundaries so hydration can reuse the crawlable HTML.
    await stream.allReady
    return new Response(stream).text()
}
