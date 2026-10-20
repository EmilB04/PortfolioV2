import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSeo } from '../hooks/useSeo'
import { NOT_FOUND_SEO } from '../lib/seo'
import PageHeader from '../components/ui/PageHeader'
import PageLayout from '../components/ui/PageLayout'

export default function NotFoundPage() {
    const { pathname } = useLocation()
    const { t } = useTranslation()
    useSeo(NOT_FOUND_SEO.title, NOT_FOUND_SEO.description, pathname, { noindex: true })
    return (
        <PageLayout>
            <PageHeader>
                <h1 className="m-0">{t('notFoundPage.title')}</h1>
                <p className="prose-organic text-[var(--text-muted)]">{t('notFoundPage.description')}</p>
            </PageHeader>
            <div className="flex flex-wrap gap-5">
                <Link to="/" className="text-[var(--accent-text)] underline">{t('nav.home')}</Link>
                <Link to="/projects" className="text-[var(--accent-text)] underline">{t('nav.projects')}</Link>
            </div>
        </PageLayout>
    )
}
