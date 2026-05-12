import { useTranslation } from 'react-i18next'

export default function ContactButton() {
    const { t } = useTranslation()

    return (
        <a
            href="/contact"
            className="hidden md:inline-flex items-center justify-center"
            style={{
                background: 'var(--accent)',
                color: '#fff',
                border: '1px solid var(--border)',
                borderRadius: '999px',
                height: '2.5rem',
                padding: '0 1rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                backdropFilter: 'blur(12px)',
                transition: 'filter 0.2s, transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(1.12)'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 10px 26px rgba(241, 55, 110, 0.32)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.filter = ''
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)'
            }}
        >
            {t('contactButton.label')}
        </a>
    )
}