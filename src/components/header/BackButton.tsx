import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { HTMLAttributes } from 'react'

type BackButtonProps = {
    to?: string
    className?: string
} & HTMLAttributes<HTMLAnchorElement>

export default function BackButton({ to = '/', className = '' }: BackButtonProps) {
    return (
        <Link
            to={to}
            aria-label="Tilbake til forsiden"
            className={
                `inline-flex items-center gap-2 rounded-full border border-[var(--c-border)] bg-[var(--c-surface)] px-4 py-2 text-xs font-medium text-[var(--c-text)] transition-all duration-200 hover:bg-[var(--c-surface-card)] hover:-translate-x-0.5 ${className}`
            }
        >
            <ArrowLeft size={16} />
            Tilbake
        </Link>
    )
}
