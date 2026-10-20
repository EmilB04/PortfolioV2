import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSeo } from '../hooks/useSeo'
import { NOT_FOUND_SEO } from '../lib/seo'

export default function NotFoundPage() {
    const { pathname } = useLocation()
    const { t } = useTranslation()
    useSeo(NOT_FOUND_SEO.title, NOT_FOUND_SEO.description, pathname, { noindex: true })
    return (
        <div className="mx-auto flex min-h-[70vh] max-w-screen-md flex-col items-start justify-center gap-5 px-5 pb-16 pt-28 md:px-10">
            <h1>{t('notFoundPage.title')}</h1>
            <p className="prose-organic text-[var(--text-muted)]">{t('notFoundPage.description')}</p>
            <Link to="/" className="text-[var(--accent-text)] underline">{t('nav.home')}</Link>
            <Link to="/projects" className="text-[var(--accent-text)] underline">{t('nav.projects')}</Link>
        </div>
    )
}
