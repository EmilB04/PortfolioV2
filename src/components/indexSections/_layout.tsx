import type { ReactNode } from 'react'

type IndexSectionProps = {
    id?: string
    children: ReactNode
    wrapperClassName?: string
    className?: string
    fullscreen?: boolean
}

/**
 * IndexLayout - Reusable template for index page sections
 *
 * Enforces:
 * - Minimum height of 100vh (full viewport height)
 * - Content centered in all directions (horizontal and vertical)
 * - Responsive padding for different screen sizes
 * - Optional fullscreen mode (ignores max-width and padding)
 *
 * @example
 * <IndexSection id="about">
 *   <h2>About Me</h2>
 *   <p>Section content here</p>
 * </IndexSection>
 */
export default function IndexLayout({ id, children, className = '', fullscreen = false }: IndexSectionProps) {
    if (fullscreen) {
        return (
            <section
                id={id}
                className={`w-screen h-screen flex items-center justify-center overflow-hidden ${className}`}
                style={{ color: 'var(--text)' }}
            >
                {children}
            </section>
        )
    }

    return (
        <section
            id={id}
            className={`w-full min-h-screen py-12 flex items-center justify-center`}
            style={{ color: 'var(--text)' }}
        >
            <div className={`"w-full max-w-6xl mx-auto flex items-center justify-center rounded-3xl backdrop-blur-sm px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24" ${className}`}>
                {children}
            </div>
        </section>
    )
}
