import type { ReactNode } from 'react'

/**
 * A tag is a physical thing — a paper label tied to a project — so it gets an
 * edge and a body of its own instead of floating as loose text. Small enough
 * to sit in long rows without shouting over the description above it.
 */
export default function Tag({ children }: { children: ReactNode }) {
    return (
        <span
            className="pebble-sm inline-flex items-center border px-2.5 py-1 text-[12.5px] leading-none text-[var(--text-muted)]"
            style={{
                borderColor: 'var(--border)',
                background: 'var(--surface-sunken)',
            }}
        >
            {children}
        </span>
    )
}

/** Wraps a row of tags with the spacing they need to read as one set. */
export function TagList({ tags, className = '' }: { tags: string[]; className?: string }) {
    return (
        <ul className={`m-0 flex list-none flex-wrap gap-1.5 p-0 ${className}`}>
            {tags.map((tag) => (
                <li key={tag}>
                    <Tag>{tag}</Tag>
                </li>
            ))}
        </ul>
    )
}
