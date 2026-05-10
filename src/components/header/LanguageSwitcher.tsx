import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '../../lib/i18n'

export default function LanguageSwitcher() {
    const { i18n } = useTranslation()

    const currentLanguage = SUPPORTED_LANGUAGES.some(
        (language) => language.code === i18n.language
    )
        ? i18n.language
        : i18n.resolvedLanguage ?? 'no'

    function handleLanguageChange(event: React.ChangeEvent<HTMLSelectElement>) {
        void i18n.changeLanguage(event.target.value)
    }

    return (
        <div className="relative inline-flex items-center">
            <span className="sr-only">Choose language</span>

            <select
                value={currentLanguage}
                onChange={handleLanguageChange}
                aria-label="Choose language"
                className="appearance-none rounded-full outline-none transition-all duration-200"
                style={{
                    height: '2.5rem',
                    padding: '0 2.25rem 0 1rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    background: 'var(--c-surface)',
                    color: 'var(--c-text)',
                    border: '1px solid var(--c-border)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.background = 'var(--c-surface-card)'
                    e.currentTarget.style.borderColor = 'var(--c-border-hover)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = ''
                    e.currentTarget.style.background = 'var(--c-surface)'
                    e.currentTarget.style.borderColor = 'var(--c-border)'
                }}
            >
                {SUPPORTED_LANGUAGES.map((language) => (
                    <option key={language.code} value={language.code}>
                        {language.label}
                    </option>
                ))}
            </select>

            <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="
                    pointer-events-none absolute right-3 h-4 w-4
                    text-[var(--c-text)]/70 transition-colors duration-200
                "
            >
                <path
                    d="M6 8l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    )
}