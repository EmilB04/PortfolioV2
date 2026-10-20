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
import SpesificProjectPage from './pages/SpesificProjectPage'
import NotFoundPage from './pages/NotFoundPage'
import { ProjectDataContext } from './context/projectDataContext'
import type { Project } from './lib/projects'

// Expose the shared metadata through the SSR bundle for plain Node prerendering.
export { ROUTE_SEO as routeSeo, NOT_FOUND_SEO as notFoundSeo, canonicalFor, structuredDataFor, projectSeoFor } from './lib/seo'

// Public project data is fetched once by the build and reused on every route.
export async function render(url: string, projects: Project[]) {
    const errors: unknown[] = []
    const stream = await renderToReadableStream(
        <StrictMode>
            <CookieConsentProvider>
                <ThemeProvider>
                    <AccentProvider>
                        <ProjectDataContext.Provider value={projects}>
                            <StaticRouter location={url}>
                                <ErrorBoundary>
                                    <Layout>
                                        <Suspense fallback={<LoadingSpinner />}>
                                            <Routes>
                                                <Route path="/" element={<Home />} />
                                                <Route path="/contact" element={<ContactPage />} />
                                                <Route path="/projects" element={<ProjectsPage />} />
                                                <Route path="/projects/:projectId" element={<SpesificProjectPage />} />
                                                <Route path="*" element={<NotFoundPage />} />
                                            </Routes>
                                        </Suspense>
                                    </Layout>
                                </ErrorBoundary>
                            </StaticRouter>
                            <CookieConsentBanner />
                        </ProjectDataContext.Provider>
                    </AccentProvider>
                </ThemeProvider>
            </CookieConsentProvider>
        </StrictMode>,
        {
            // Large completed boundaries must stay inline in static HTML,
            // rather than require scripts to move hidden streaming chunks.
            progressiveChunkSize: Number.POSITIVE_INFINITY,
            onError: error => { errors.push(error) },
        },
    )
    await stream.allReady
    if (errors.length) throw new AggregateError(errors, `Failed to prerender ${url}`)
    return new Response(stream).text()
}
