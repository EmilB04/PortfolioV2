import { useTranslation } from 'react-i18next'
import { Github } from '../../lib/icons'

/**
 * The page ends on the ground line of the backdrop, so the footer stays open —
 * a rule, three facts, no boxed card competing with the ridges behind it.
 */
export default function FooterSection() {
    const { t } = useTranslation()

    return (
        <footer aria-label="Site footer" className="w-full px-5 pb-10 pt-24 md:px-10">
            <div className="mx-auto w-full max-w-screen-xl">
                <div className="h-px w-full" style={{ background: 'var(--border)' }} aria-hidden="true" />

                <div className="flex flex-col gap-6 pt-7 md:flex-row md:items-center md:justify-between">
                    <p className="m-0 max-w-[40ch] text-[15px] text-[var(--text-muted)]">
                        {t('footer.tagline')}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                        <a
                            href="https://github.com/EmilB04"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[15px] font-medium text-[var(--text)] transition-colors hover:text-[var(--accent-text)]"
                        >
                            <Github size={17} aria-hidden="true" />
                            <span>{t('footer.github')}</span>
                        </a>

                        <p className="m-0 text-[15px] text-[var(--text-muted)]">
                            {t('footer.madeBy')}{' '}
                            <strong className="font-semibold" style={{ color: 'var(--text)' }}>
                                Emil Berglund
                            </strong>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
