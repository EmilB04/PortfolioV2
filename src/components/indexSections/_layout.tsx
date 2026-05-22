import type { ReactNode } from 'react'

type IndexSectionProps = {
    id?: string
    children: ReactNode
    className?: string
    fullscreen?: boolean
    fullWidth?: boolean
}

export default function IndexLayout({ id, children, className = '', fullscreen = false, fullWidth = false }: IndexSectionProps) {
    if (fullscreen) {
        return (
            <section
                id={id}
                className={`scroll-mt-16 w-screen h-screen flex items-center justify-center overflow-hidden ${className}`}
                style={{ color: 'var(--text)' }}
            >
                {children}
            </section>
        )
    }

    if (fullWidth) {
        return (
            <section
                id={id}
                className={`scroll-mt-16 w-full min-h-screen py-12 flex items-center justify-center ${className}`}
                style={{ color: 'var(--text)' }}
            >
                {children}
            </section>
        )
    }

    return (
        <section
            id={id}
            className="scroll-mt-16 w-full min-h-screen py-12 flex items-center justify-center"
            style={{ color: 'var(--text)' }}
        >
            <div className={`w-full max-w-6xl mx-auto flex items-center justify-center backdrop-blur-sm px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 ${className}`}>
                {children}
            </div>
        </section>
    )
}
