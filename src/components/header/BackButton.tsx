import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { HTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'

type BackButtonProps = {
    to?: string
    className?: string
} & HTMLAttributes<HTMLAnchorElement>

export default function BackButton({ to = '/', className = '' }: BackButtonProps) {
    const { t } = useTranslation()

    return (
        <Link
            to={to}
            aria-label={t('backButton.aria')}
            className={
                `inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-medium text-[var(--text)] transition-all duration-200 hover:bg-[var(--surface-card)] hover:-translate-x-0.5 ${className}`
            }
        >
            <ArrowLeft size={16} />
            {t('backButton.label')}
        </Link>
    )
}
