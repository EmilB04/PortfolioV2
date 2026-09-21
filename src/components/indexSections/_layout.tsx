import type { ReactNode } from 'react'

type IndexSectionProps = {
    id?: string
    children: ReactNode
    className?: string
    fullscreen?: boolean
    fullWidth?: boolean
    /** Lays the section on a sunken stratum with soft, uneven edges. */
    band?: boolean
}

/**
 * Sections are strata, not slides. Vertical rhythm comes from generous
 * padding rather than forcing every block to fill the viewport, and banded
 * sections cut into the page with an uneven edge so the stack of content
 * reads as layered ground.
 */
function BandEdge({ position }: { position: 'top' | 'bottom' }) {
    return (
        <svg
            className={`pointer-events-none absolute inset-x-0 ${position === 'top' ? '-top-px' : '-bottom-px rotate-180'} h-[34px] w-full`}
            viewBox="0 0 1440 40"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
        >
            <path
                d="M0 40 C 180 8 300 34 470 24 C 640 14 720 34 880 30 C 1040 26 1160 6 1300 16 C 1370 21 1412 31 1440 28 L1440 40 Z"
                fill="var(--surface-sunken)"
            />
        </svg>
    )
}

export default function IndexLayout({
    id,
    children,
    className = '',
    fullscreen = false,
    fullWidth = false,
    band = false,
}: IndexSectionProps) {
    if (fullscreen) {
        return (
            <section
                id={id}
                className={`scroll-mt-24 flex h-screen w-screen items-center justify-center overflow-hidden ${className}`}
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
                className={`scroll-mt-24 flex w-full items-center justify-center py-20 md:py-28 ${className}`}
                style={{ color: 'var(--text)' }}
            >
                {children}
            </section>
        )
    }

    return (
        <section
            id={id}
            className="relative isolate w-full scroll-mt-24 py-20 md:py-28"
            style={{ color: 'var(--text)' }}
        >
            {band && (
                <>
                    <div
                        className="pointer-events-none absolute inset-x-0 top-[33px] bottom-[33px] -z-10"
                        style={{ background: 'var(--surface-sunken)' }}
                        aria-hidden="true"
                    />
                    <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34px]">
                        <BandEdge position="top" />
                    </div>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[34px]">
                        <BandEdge position="bottom" />
                    </div>
                </>
            )}

            <div className={`mx-auto w-full max-w-screen-xl px-5 md:px-10 ${className}`}>
                {children}
            </div>
        </section>
    )
}
