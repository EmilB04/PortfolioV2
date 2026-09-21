import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type BackButtonProps = {
    fallback?: string
    className?: string
    /** Matches the header rail: solid backing once the page scrolls. */
    settled?: boolean
}

export default function BackButton({ fallback = '/', className = '', settled = false }: BackButtonProps) {
    const { t } = useTranslation()
    const navigate = useNavigate()

    function handleBack() {
        if (window.history.state?.idx > 0) {
            navigate(-1)
        } else {
            navigate(fallback)
        }
    }

    return (
        <button
            type="button"
            onClick={handleBack}
            aria-label={t('backButton.aria')}
            className={
                `nav-island inline-flex h-11 gap-2 px-5 text-sm font-medium text-[var(--text)] ${settled ? 'nav-island--settled' : ''} ${className}`
            }
        >
            <ArrowLeft size={16} aria-hidden="true" />
            {t('backButton.label')}
        </button>
    )
}
