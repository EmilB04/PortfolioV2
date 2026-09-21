import { useState } from 'react'
import type { ReactNode } from 'react'
import { CookieConsentContext } from './cookieConsentContext'
import { removeStored } from '../lib/cookieConsent'
import type { ConsentStatus } from '../lib/cookieConsent'

const CONSENT_KEY = 'cookie-consent'

/** Everything this site may keep on the device, by storage area. */
const STORED_KEYS: { key: string; area: 'local' | 'session' }[] = [
    { key: 'portfolio-theme', area: 'local' },
    { key: 'portfolio-accent', area: 'local' },
    { key: 'portfolio-lang', area: 'local' },
    { key: 'ai_chat_messages', area: 'local' },
    { key: 'github-section:EmilB04:v2', area: 'session' },
    { key: 'github-section:EmilB04:blocked-until', area: 'session' },
    { key: 'portfolio_admin_upload_key', area: 'session' },
]

function readConsent(): ConsentStatus {
    if (typeof window === 'undefined') return null
    try {
        const stored = window.localStorage.getItem(CONSENT_KEY)
        return stored === 'accepted' || stored === 'declined' ? stored : null
    } catch {
        return null
    }
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
    const [consent, setConsent] = useState<ConsentStatus>(readConsent)
    const [bannerVisible, setBannerVisible] = useState<boolean>(() => readConsent() === null)

    // The consent record itself is the one thing written without consent: it is
    // what remembers the visitor's answer, and holds nothing else about them.
    function accept() {
        try {
            window.localStorage.setItem(CONSENT_KEY, 'accepted')
        } catch {
            // Blocked storage — the choice then applies to this page only.
        }
        setConsent('accepted')
        setBannerVisible(false)
    }

    function decline() {
        try {
            window.localStorage.setItem(CONSENT_KEY, 'declined')
        } catch {
            // As above.
        }
        STORED_KEYS.forEach(({ key, area }) => removeStored(key, area))
        setConsent('declined')
        setBannerVisible(false)
    }

    function showBanner() {
        setBannerVisible(true)
    }

    return (
        <CookieConsentContext.Provider value={{ consent, bannerVisible, accept, decline, showBanner }}>
            {children}
        </CookieConsentContext.Provider>
    )
}
