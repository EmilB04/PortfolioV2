export type ConsentStatus = 'accepted' | 'declined' | null

const CONSENT_KEY = 'cookie-consent'

type Area = 'local' | 'session'

function store(area: Area): Storage | null {
    if (typeof window === 'undefined') return null
    try {
        return area === 'local' ? window.localStorage : window.sessionStorage
    } catch {
        // Storage can throw outright when the browser blocks site data.
        return null
    }
}

export function getConsent(): ConsentStatus {
    const s = store('local')
    if (!s) return null
    try {
        const stored = s.getItem(CONSENT_KEY)
        return stored === 'accepted' || stored === 'declined' ? stored : null
    } catch {
        return null
    }
}

export function hasConsent(): boolean {
    return getConsent() === 'accepted'
}

/**
 * Every read of local or session storage in the app goes through here, so
 * nothing is read back from the visitor's device until they have accepted.
 * Without consent this reports "nothing stored", and callers fall back to
 * in-memory state that lives only as long as the page.
 */
export function readStored(key: string, area: Area = 'local'): string | null {
    if (!hasConsent()) return null
    const s = store(area)
    if (!s) return null
    try {
        return s.getItem(key)
    } catch {
        return null
    }
}

/** Writes only after consent; a no-op otherwise. */
export function writeStored(key: string, value: string, area: Area = 'local') {
    if (!hasConsent()) return
    const s = store(area)
    if (!s) return
    try {
        s.setItem(key, value)
    } catch {
        // Quota or blocked storage — the value simply is not kept.
    }
}

/** Removal needs no consent: clearing data is always allowed. */
export function removeStored(key: string, area: Area = 'local') {
    const s = store(area)
    if (!s) return
    try {
        s.removeItem(key)
    } catch {
        // Nothing to clean up if storage is unavailable.
    }
}

export function readPreference(key: string): string | null {
    return readStored(key)
}

export function writePreference(key: string, value: string) {
    writeStored(key, value)
}
