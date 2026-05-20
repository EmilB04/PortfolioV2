import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type ContactCardProps = {
    title: string
    description?: string
    buttonLabel: string
    href?: string
    external?: boolean
    icon: ReactNode
}

const sharedClass =
    'group w-full min-w-[18rem] basis-[18rem] flex-1 flex flex-col items-center text-center bg-[var(--surface-card)] border border-[var(--border)] rounded-2xl p-8 shadow-[var(--shadow)] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-lg active:scale-[0.98]'

function CardContent({ icon, title, description, buttonLabel }: Omit<ContactCardProps, 'href' | 'external'>) {
    return (
        <>
            <div
                className="w-20 h-20 rounded-xl flex items-center justify-center mb-6 text-[var(--accent)] transition-transform duration-200 group-hover:scale-110"
                style={{ background: 'color-mix(in srgb, var(--accent) 12%, transparent)' }}
            >
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[var(--text)]">{title}</h3>
            {description && (
                <p className="text-sm text-[var(--text-subtle)] mb-6 flex-1">{description}</p>
            )}
            <span className="mt-auto inline-flex items-center px-6 py-3 rounded-full bg-[var(--accent)] text-black text-sm font-semibold shadow-md transition-transform duration-200 group-hover:scale-105">
                {buttonLabel}
            </span>
        </>
    )
}

export default function ContactCard({ title, description, buttonLabel, href, external, icon }: ContactCardProps) {
    if (href && external) {
        return (
            <a href={href} target="_blank" rel="noreferrer" className={sharedClass}>
                <CardContent icon={icon} title={title} description={description} buttonLabel={buttonLabel} />
            </a>
        )
    }

    if (href) {
        return (
            <Link to={href} className={sharedClass}>
                <CardContent icon={icon} title={title} description={description} buttonLabel={buttonLabel} />
            </Link>
        )
    }

    return (
        <button type="button" className={sharedClass}>
            <CardContent icon={icon} title={title} description={description} buttonLabel={buttonLabel} />
        </button>
    )
}
