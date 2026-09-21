import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useCookieConsent } from '../hooks/useCookieConsent'

export default function CookieConsentBanner() {
    const { t } = useTranslation()
    const { bannerVisible, accept, decline } = useCookieConsent()

    return (
        <AnimatePresence>
            {bannerVisible && (
                <motion.div
                    role="dialog"
                    aria-label={t('cookieConsent.section')}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 24 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="pointer-events-none fixed inset-x-0 bottom-0 z-[500] flex justify-center px-4 pb-4 md:px-6"
                >
                    <div
                        className="pointer-events-auto pebble flex w-full max-w-screen-md flex-col gap-4 border p-5 shadow-[var(--shadow-lifted)] backdrop-blur-2xl md:flex-row md:items-center md:justify-between"
                        style={{
                            background: 'color-mix(in srgb, var(--surface-card) 94%, transparent)',
                            borderColor: 'var(--border)',
                        }}
                    >
                        <p className="text-sm text-[var(--text-muted)]">
                            {t('cookieConsent.message')}
                        </p>
                        <div className="flex shrink-0 gap-2">
                            <button
                                type="button"
                                onClick={decline}
                                className="pebble-sm border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text-subtle)] transition-colors duration-200 hover:text-[var(--text)]"
                            >
                                {t('cookieConsent.decline')}
                            </button>
                            <button
                                type="button"
                                onClick={accept}
                                className="pebble-sm bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--on-accent)] transition-transform duration-200 hover:-translate-y-0.5"
                            >
                                {t('cookieConsent.accept')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
