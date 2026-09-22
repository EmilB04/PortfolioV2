import { useTranslation } from 'react-i18next'
import { FALLBACK_LANGUAGE, SUPPORTED_LANGUAGES } from '../lib/i18n.ts'
import { writePreference } from '../lib/cookieConsent'

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code']

/** Current language plus a setter that also persists the choice. */
export function useLanguage() {
    const { i18n } = useTranslation()

    const current: LanguageCode =
        SUPPORTED_LANGUAGES.find((language) => language.code === i18n.language)?.code ??
        SUPPORTED_LANGUAGES.find((language) => language.code === i18n.resolvedLanguage)?.code ??
        FALLBACK_LANGUAGE

    async function select(code: LanguageCode) {
        await i18n.changeLanguage(code)
        writePreference('portfolio-lang', code)
    }

    return { current, select }
}
