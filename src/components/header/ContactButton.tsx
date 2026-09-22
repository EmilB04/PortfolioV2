import { useTranslation } from 'react-i18next'

export default function ContactButton() {
    const { t } = useTranslation()

    return (
        <a
            href="/contact"
            className="hidden h-11 items-center justify-center whitespace-nowrap rounded-full px-5 text-sm font-semibold text-[var(--on-accent)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0.28,1)] hover:-translate-y-0.5 hover:text-[var(--on-accent)] md:inline-flex"
            style={{ background: 'var(--accent-solid)', boxShadow: 'var(--shadow)' }}
        >
            {t('contactButton.label')}
        </a>
    )
}
