import type { ReactNode } from 'react'

/** One width, gutter and alignment for page content and the site chrome. */
export default function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <div className={`site-container ${className}`}>{children}</div>
}
