import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import i18n, { PRERENDER_LANGUAGE } from './lib/i18n'
import './styles/index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeProvider'
import { AccentProvider } from './context/AccentProvider'
import { CookieConsentProvider } from './context/CookieConsentProvider'
import CookieConsentBanner from './components/CookieConsentBanner'
import ErrorBoundary from './components/ErrorBoundary'

const app = (
  <StrictMode>
    <CookieConsentProvider>
      <ThemeProvider>
        <AccentProvider>
          <BrowserRouter>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </BrowserRouter>
          <CookieConsentBanner />
        </AccentProvider>
      </ThemeProvider>
    </CookieConsentProvider>
  </StrictMode>
)

const rootEl = document.getElementById('root')!
// The prerender step stamps the route it baked into this HTML. Only hydrate
// when it matches where the browser actually is — otherwise (a route that
// wasn't prerendered, served via the SPA fallback) the DOM holds a different
// page's markup and hydrating against it would just produce a mismatch, so a
// plain client render replaces it instead. The same goes for language: the
// HTML is baked in PRERENDER_LANGUAGE, so a visitor reading another language
// gets a fresh render rather than a hydration mismatch.
const ssrPath = rootEl.getAttribute('data-ssr-path')
const ssrMatchesLanguage = (i18n.resolvedLanguage ?? i18n.language) === PRERENDER_LANGUAGE
if (ssrPath && ssrPath === window.location.pathname && ssrMatchesLanguage) {
  hydrateRoot(rootEl, app)
} else {
  createRoot(rootEl).render(app)
}
