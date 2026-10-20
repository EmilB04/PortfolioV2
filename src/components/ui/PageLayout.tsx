import type { ReactNode } from 'react'
import Container from './Container'

type PageLayoutProps = {
    children: ReactNode
    id?: string
    className?: string
}

export default function PageLayout({ children, id, className = '' }: PageLayoutProps) {
    return (
        <section id={id} className="page-layout">
            <Container className={className}>{children}</Container>
        </section>
    )
}
