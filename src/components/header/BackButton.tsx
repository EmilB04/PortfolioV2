import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type BackButtonProps = {
    fallback?: string
    className?: string
}

export default function BackButton({ fallback = '/', className = '' }: BackButtonProps) {
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
                `inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-medium text-[var(--text)] transition-all duration-200 hover:bg-[var(--surface-card)] hover:-translate-x-0.5 ${className}`
            }
        >
            <ArrowLeft size={16} />
            {t('backButton.label')}
        </button>
    )
}
