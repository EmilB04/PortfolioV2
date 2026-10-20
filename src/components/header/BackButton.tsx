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
                `inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--surface-card)] hover:text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-text)] motion-reduce:transition-none ${className}`
            }
        >
            <ArrowLeft size={16} aria-hidden="true" />
            {t('backButton.label')}
        </button>
    )
}
