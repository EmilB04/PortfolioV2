import { useTranslation } from 'react-i18next'
import { Github } from '../../lib/icons'

export default function FooterSection() {
    const { t } = useTranslation()
    const year = new Date().getFullYear()

    return (
        <footer aria-label="Site footer" className="w-full px-4 pb-4 pt-12 sm:px-6">
            <div
                className="mx-auto w-full max-w-6xl rounded-3xl border px-5 py-5 text-center sm:px-6 sm:py-6"
                style={{
                    background: 'var(--surface)',
                    borderColor: 'var(--border)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                }}
            >
                <p
                    className="mb-4 text-xs font-semibold uppercase tracking-[0.04em] sm:text-sm"
                    style={{ color: 'var(--text-muted)' }}
                >
                    {t('footer.tagline')}
                </p>

                <a
                    href="https://github.com/EmilB04"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Besøk GitHub-profilen til Emil Berglund"
                    className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-3 font-semibold transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                        color: 'var(--text)',
                        borderColor: 'var(--border)',
                        background: 'rgba(255, 255, 255, 0.04)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-hover)'
                        e.currentTarget.style.color = 'var(--accent)'
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border)'
                        e.currentTarget.style.color = 'var(--text)'
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'
                    }}
                >
                    <Github size={18} />
                    <span>{t('footer.github')}</span>
                </a>

                <p className="m-0 text-sm sm:text-[0.98rem]" style={{ color: 'var(--text-muted)' }}>
                    {t('footer.madeBy')} <strong style={{ color: 'var(--text)' }}>Emil Berglund</strong>
                    <span className="mx-2" style={{ color: 'var(--text-subtle)' }} aria-hidden="true">
                        •
                    </span>
                    <span>{t('footer.updated', { year })}</span>
                </p>
            </div>
        </footer>
    )
}
