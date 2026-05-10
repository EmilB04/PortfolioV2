import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

type ContactCardProps = {
    title: string
    description?: string
    buttonLabel: string
    href?: string
    external?: boolean
    icon: ReactNode
}

export default function ContactCard({ title, description, buttonLabel, href, external, icon }: ContactCardProps) {
    const cardMotion = {
        rest: { y: 0, scale: 1 },
        hover: { y: -8, scale: 1.015 },
        tap: { scale: 0.99 },
    }

    const iconMotion = {
        rest: { rotate: 0, scale: 1 },
        hover: { rotate: -6, scale: 1.05 },
    }

    const content = (
        <motion.div
            className="bg-[var(--c-surface-card)] border border-[var(--c-border)] rounded-2xl p-8 shadow-[var(--shadow)] flex flex-col items-center text-center max-w-lg mx-auto will-change-transform"
            initial="rest"
            animate="rest"
            whileHover="hover"
            whileTap="tap"
            variants={cardMotion}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        >
            <motion.div
                className="w-20 h-20 rounded-lg flex items-center justify-center mb-6 text-[var(--c-accent)]"
                variants={iconMotion}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
                {icon}
            </motion.div>
            <h3 className="text-xl font-semibold mb-2 text-[var(--c-text)]">{title}</h3>
            {description && <p className="text-sm text-[var(--c-text-subtle)] mb-6">{description}</p>}
            {href ? (
                external ? (
                    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--c-accent)] text-black text-sm font-medium shadow-md hover:brightness-95 transition-transform duration-200 hover:scale-105 active:scale-95">
                        {buttonLabel}
                    </a>
                ) : (
                    <Link to={href} className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--c-accent)] text-black text-sm font-medium shadow-md hover:brightness-95 transition-transform duration-200 hover:scale-105 active:scale-95">
                        {buttonLabel}
                    </Link>
                )
            ) : (
                <button className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--c-accent)] text-black text-sm font-medium shadow-md hover:brightness-95 transition-transform duration-200 hover:scale-105 active:scale-95">
                    {buttonLabel}
                </button>
            )}
        </motion.div>
    )

    return content
}
