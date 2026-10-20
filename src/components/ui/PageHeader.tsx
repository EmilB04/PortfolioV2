import type { ReactNode } from 'react'
import BackButton from '../header/BackButton'

type PageHeaderProps = {
    children?: ReactNode
    fallback?: string
    className?: string
}

/** Keeps the return action with the page it belongs to, above its heading. */
export default function PageHeader({ children, fallback = '/', className = 'mb-10' }: PageHeaderProps) {
    return (
        <header className={`flex flex-col gap-6 ${className}`}>
            <BackButton fallback={fallback} />
            {children && <div className="flex min-w-0 flex-col gap-4">{children}</div>}
        </header>
    )
}
