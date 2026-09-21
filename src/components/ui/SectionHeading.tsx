import type { ReactNode } from 'react'

type SectionHeadingProps = {
    title: string
    /** Sits under the title, in the same column, so controls never move it. */
    lead?: string
    /** Controls or a link for this section: own column at the far end. */
    aside?: ReactNode
    className?: string
}

/**
 * One heading shape for the whole page.
 *
 * The title and its lead form a single left column and always read as one
 * block — the lead starts where the title starts, wraps at a readable
 * measure, and keeps its position whether or not the section has controls.
 * Anything interactive lives in its own column at the opposite end, aligned
 * to the title rather than stacked on top of the text.
 */
export default function SectionHeading({ title, lead, aside, className = '' }: SectionHeadingProps) {
    return (
        <div className={`mb-12 flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-16 ${className}`}>
            <div className="flex min-w-0 flex-col gap-4">
                <h2 className="m-0 max-w-[18ch]">{title}</h2>
                {lead && <p className="prose-organic max-w-[54ch] text-[var(--text-muted)]">{lead}</p>}
            </div>

            {aside && (
                <div className="flex shrink-0 flex-col items-start gap-3 md:items-end md:pt-2">
                    {aside}
                </div>
            )}
        </div>
    )
}
