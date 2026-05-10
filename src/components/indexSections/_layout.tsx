import type { ReactNode } from 'react'

type IndexSectionProps = {
    id?: string
    children: ReactNode
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
            className={`w-full min-h-screen flex items-center justify-center ${className}`}
            style={{ color: 'var(--text)' }}
        >
            <div className="w-full max-w-6xl mx-auto flex items-center justify-center rounded-3xl backdrop-blur-sm sm:px-10 sm:py-10 lg:px-12">
                {children}
            </div>
        </section>
    )
}
