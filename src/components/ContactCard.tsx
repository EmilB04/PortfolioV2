import React from 'react'
import { Link } from 'react-router-dom'

type ContactCardProps = {
    title: string
    description?: string
    buttonLabel: string
    href?: string
    external?: boolean
    icon: React.ReactNode
}

export default function ContactCard({ title, description, buttonLabel, href, external, icon }: ContactCardProps) {
    const content = (
        <div className="w-full min-w-[18rem] basis-[18rem] flex-1 bg-[var(--c-surface-card)] border border-[var(--c-border)] rounded-2xl p-8 shadow-[var(--shadow)] flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-lg flex items-center justify-center mb-6 text-[var(--c-accent)]">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[var(--c-text)]">{title}</h3>
            {description && <p className="text-sm text-[var(--c-text-subtle)] mb-6">{description}</p>}
            {href ? (
                external ? (
                    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center px-6 py-3 rounded-full bg-[var(--c-accent)] text-black text-sm font-medium shadow-md hover:brightness-95 transition">
                        {buttonLabel}
                    </a>
                ) : (
                    <Link to={href} className="inline-flex items-center px-6 py-3 rounded-full bg-[var(--c-accent)] text-black text-sm font-medium shadow-md hover:brightness-95 transition">
                        {buttonLabel}
                    </Link>
                )
            ) : (
                <button className="inline-flex items-center px-6 py-3 rounded-full bg-[var(--c-accent)] text-black text-sm font-medium shadow-md hover:brightness-95 transition">
                    {buttonLabel}
                </button>
            )}
        </div>
    )

    return content
}
