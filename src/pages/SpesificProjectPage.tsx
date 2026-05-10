
import { useTranslation } from 'react-i18next'

export default function SpesificProjectPage() {
    const { t } = useTranslation()

    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">{t('projectDetails.title')}</h1>
            <p className="mb-4">{t('projectDetails.description')}</p>
            <h2 className="text-2xl font-semibold mb-2">{t('projectDetails.techTitle')}</h2>
            <ul className="list-disc list-inside mb-4">
                <li>React</li>
                <li>TypeScript</li>
                <li>Supabase</li>
            </ul>
            <h2 className="text-2xl font-semibold mb-2">{t('projectDetails.highlightsTitle')}</h2>
            <p>{t('projectDetails.highlight')}</p>
            <a href="/projects" className="inline-block mt-4 text-blue-600 hover:underline">{t('projectDetails.back')}</a>
        </main>
    )
}