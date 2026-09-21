import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowRight, Send } from 'lucide-react'
import IndexLayout from '../components/indexSections/_layout'
import { useSeo } from '../hooks/useSeo'
import { ROUTE_SEO } from '../lib/seo'

// avatars.githubusercontent.com serves the same image without the cookies
// github.com sets on its redirect (_gh_sess, _octo, logged_in).
const AVATAR_URL = 'https://avatars.githubusercontent.com/u/111691856?v=4&s=128'

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
} as const

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
}

function WindowChrome({ label, dark, children }: { label: string; dark?: boolean; children: ReactNode }) {
    return (
        <div className="overflow-hidden border-b border-[var(--border)]">
            <div
                className="flex items-center gap-3 px-4 py-2.5"
                style={{ background: dark ? '#161b22' : 'var(--surface)' }}
            >
                <div className="flex flex-shrink-0 gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                </div>
                <div
                    className={`flex-1 truncate rounded-full px-3 py-1 text-center text-[11px] ${dark ? 'bg-white/5 text-white/50' : 'bg-[var(--surface-card)] text-[var(--text-subtle)]'
                        }`}
                >
                    {label}
                </div>
            </div>
            {children}
        </div>
    )
}

function LinkedInPreview({ headline }: { headline: string }) {
    return (
        <div className="h-48 overflow-hidden" style={{ background: '#eef3f8' }}>
            <div className="h-14 w-full" style={{ background: 'linear-gradient(135deg, #0A66C2, #004182)' }} />
            <div className="relative px-5">
                <img
                    src={AVATAR_URL}
                    alt=""
                    className="absolute -top-8 h-16 w-16 rounded-full border-[3px] object-cover"
                    style={{ borderColor: '#eef3f8' }}
                />
            </div>
            <div className="px-5 pt-10">
                <p className="text-sm font-bold" style={{ color: '#1d1d1d' }}>Emil Berglund</p>
                <p className="truncate text-xs" style={{ color: '#00000099' }}>{headline}</p>
                <div className="mt-3 flex gap-2">
                    <span className="rounded-full px-3 py-1 text-[11px] font-semibold text-white" style={{ background: '#0A66C2' }}>
                        Connect
                    </span>
                    <span
                        className="rounded-full border px-3 py-1 text-[11px] font-semibold"
                        style={{ borderColor: '#0A66C2', color: '#0A66C2' }}
                    >
                        Message
                    </span>
                </div>
            </div>
        </div>
    )
}

function GitHubPreview() {
    return (
        <div className="h-48 overflow-hidden p-4" style={{ background: '#0d1117', fontFamily: 'var(--mono)' }}>
            <p className="text-[11px]" style={{ color: '#8b949e' }}>
                <span style={{ color: '#7ee787' }}>emil@portfolio</span>
                <span>:</span>
                <span style={{ color: '#79c0ff' }}>~</span>
                <span>$ open github.com/EmilB04</span>
                <span className="ml-1 animate-[blink_0.7s_step-end_infinite]" style={{ color: '#7ee787' }}>▍</span>
            </p>

            <div className="mt-4 flex items-center gap-3">
                <img src={AVATAR_URL} alt="" className="h-11 w-11 rounded-full border-2" style={{ borderColor: '#30363d' }} />
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold" style={{ color: '#e6edf3' }}>EmilB04</p>
                    <p className="truncate text-[11px]" style={{ color: '#8b949e' }}>Emil Berglund</p>
                </div>
            </div>

            <span
                className="mt-4 inline-block rounded-md px-3 py-1.5 text-[11px] font-semibold text-white"
                style={{ background: '#238636' }}
            >
                Follow
            </span>
        </div>
    )
}

function EmailPreview({ composeLabel, subject }: { composeLabel: string; subject: string }) {
    return (
        <div className="h-48 overflow-hidden p-4" style={{ background: 'var(--surface)' }}>
            <p className="mb-3 text-xs text-[var(--text-subtle)]">{composeLabel}</p>

            <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
                    <span className="flex-shrink-0 text-[var(--text-subtle)]">To:</span>
                    <span className="truncate text-[var(--text)]">emil.berglund+portfolio@live.no</span>
                </div>
                <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
                    <span className="flex-shrink-0 text-[var(--text-subtle)]">Subject:</span>
                    <span className="truncate font-medium text-[var(--text)]">{subject}</span>
                </div>
            </div>

            <div className="mt-3 space-y-1.5">
                <div className="h-2 w-full rounded bg-[var(--border)]" />
                <div className="h-2 w-5/6 rounded bg-[var(--border)]" />
            </div>

            <div className="mt-4 flex justify-end">
                <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-[var(--on-accent)]"
                    style={{ background: 'var(--accent-solid)' }}
                >
                    Send
                    <Send size={11} aria-hidden="true" />
                </span>
            </div>
        </div>
    )
}

type PlatformCardProps = {
    href: string
    label: string
    dark?: boolean
    preview: ReactNode
    title: string
    description: string
    buttonLabel: string
}

function PlatformCard({ href, label, dark, preview, title, description, buttonLabel }: PlatformCardProps) {
    return (
        <motion.a
            variants={fadeUp}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="card-organic group flex h-full flex-col overflow-hidden hover:-translate-y-1"
        >
            <WindowChrome label={label} dark={dark}>
                {preview}
            </WindowChrome>

            <div className="flex flex-1 flex-col p-6">
                <h2 className="m-0 mb-2 text-lg font-semibold text-[var(--text)]">{title}</h2>
                <p className="prose-organic mb-5 flex-1 text-[15px] text-[var(--text-muted)]">{description}</p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-text)] transition-[gap] duration-300 group-hover:gap-3">
                    {buttonLabel}
                    <ArrowRight size={14} aria-hidden="true" />
                </span>
            </div>
        </motion.a>
    )
}

export default function Contact() {
    const { t } = useTranslation()
    const roles = t('home.roles', { returnObjects: true }) as string[]
    const headline = roles[0]
    useSeo(ROUTE_SEO['/contact'].title, ROUTE_SEO['/contact'].description, '/contact')

    return (
        <IndexLayout id="contact">
            <section className="pt-16">
                <motion.div
                    className="mb-14 flex flex-col gap-4"
                    initial="hidden"
                    animate="show"
                    variants={fadeUp}
                >
                    <h1 className="m-0 max-w-[18ch]">{t('contactPage.title')}</h1>
                    <p className="prose-organic max-w-[54ch] text-[var(--text-muted)]">
                        {t('contactPage.subtitle')}
                    </p>
                </motion.div>

                <motion.div
                    className="pebble-set grid items-stretch gap-6 md:grid-cols-3"
                    initial="hidden"
                    animate="show"
                    variants={containerVariants}
                >
                    <PlatformCard
                        href="https://www.linkedin.com/in/emilber/"
                        label="linkedin.com/in/emilber"
                        preview={<LinkedInPreview headline={headline} />}
                        title={t('contactPage.cards.linkedin.title')}
                        description={t('contactPage.cards.linkedin.description')}
                        buttonLabel={t('contactPage.cards.linkedin.button')}
                    />

                    <PlatformCard
                        href="https://github.com/emilb04"
                        label="github.com/EmilB04"
                        dark
                        preview={<GitHubPreview />}
                        title={t('contactPage.cards.github.title')}
                        description={t('contactPage.cards.github.description')}
                        buttonLabel={t('contactPage.cards.github.button')}
                    />

                    <PlatformCard
                        href="mailto:emil.berglund+portfolio@live.no"
                        label={t('contactPage.cards.email.compose')}
                        preview={
                            <EmailPreview
                                composeLabel={t('contactPage.cards.email.compose')}
                                subject={t('contactPage.cards.email.subject')}
                            />
                        }
                        title={t('contactPage.cards.email.title')}
                        description={t('contactPage.cards.email.description')}
                        buttonLabel={t('contactPage.cards.email.button')}
                    />
                </motion.div>
            </section>
        </IndexLayout>
    )
}
