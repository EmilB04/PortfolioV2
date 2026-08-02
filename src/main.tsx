import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './lib/i18n'
import './styles/index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeProvider'
import { AccentProvider } from './context/AccentProvider'
import { CookieConsentProvider } from './context/CookieConsentProvider'
import CookieConsentBanner from './components/CookieConsentBanner'
import ErrorBoundary from './components/ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CookieConsentProvider>
      <ThemeProvider>
        <AccentProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </BrowserRouter>
          <CookieConsentBanner />
        </AccentProvider>
      </ThemeProvider>
    </CookieConsentProvider>
  </StrictMode>,
)
