import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
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

// Only the routes worth a real crawl get a server entry here: the ones with
// static, translated copy (no Supabase/GitHub fetch on first paint). The
// project-detail route stays client-only — its content is per-project data
// that only exists after a network round trip, so prerendering it would just
// bake in a skeleton.
export function render(url: string) {
    return renderToString(
        <StrictMode>
            <StaticRouter location={url}>
                <CookieConsentProvider>
                    <ThemeProvider>
                        <AccentProvider>
                            <ErrorBoundary>
                                <Layout>
                                    <Routes>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/contact" element={<ContactPage />} />
                                        <Route path="/projects" element={<ProjectsPage />} />
                                    </Routes>
                                </Layout>
                            </ErrorBoundary>
                        </AccentProvider>
                    </ThemeProvider>
                </CookieConsentProvider>
            </StaticRouter>
        </StrictMode>,
    )
}
