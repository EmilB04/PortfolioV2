import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { GraduationCap, UserRound, Gamepad2, type LucideIcon } from 'lucide-react'
import IndexLayout from "./_layout";
import { INDEX_PATHS } from '../../routes/indexPaths'

const SERIF = "'Lora', serif"

function getAge() {
    const today = new Date();
    const birthDate = new Date(2004, 3, 11);
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const hasHadBirthdayThisYear =
        monthDifference > 0 ||
        (monthDifference === 0 && today.getDate() >= birthDate.getDate());

    return (
        today.getFullYear() -
        birthDate.getFullYear() -
        (hasHadBirthdayThisYear ? 0 : 1)
    );
}

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
}

type ArticleProps = {
    icon: LucideIcon
    kicker: string
    title: string
    body: string
}

function Article({ icon: Icon, kicker, title, body }: ArticleProps) {
    const dropCap = body.slice(0, 1)
    const rest = body.slice(1)

    return (
        <div className="flex h-full flex-col" style={{ fontFamily: SERIF }}>
            <div className="mb-3 flex items-center gap-2">
                <Icon size={15} className="text-[var(--accent)]" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                    {kicker}
                </span>
            </div>

            <h3 className="mb-3 text-2xl font-bold leading-tight text-[var(--text-h)]">{title}</h3>

            <div className="mb-4 border-t-4 border-double border-[var(--border)]" />

            <p className="flex-1 text-[15px] leading-7 text-[var(--text-muted)]">
                <span className="float-left mr-2 mt-1 text-5xl font-bold leading-[0.75] text-[var(--accent)]">
                    {dropCap}
                </span>
                {rest}
            </p>
        </div>
    )
}

export default function AboutMe() {
    const { t } = useTranslation()

    const student = t('about.student')
    const person = t('about.person', { age: getAge() })
    const leisure = t('about.leisure')

    return (
        <IndexLayout id={INDEX_PATHS.ABOUT}>
            <style>{`
                @keyframes aboutFloat {
                    from { transform: translate(0, 0); }
                    to { transform: translate(-18px, -22px); }
                }
                .about-orb-1 { animation: aboutFloat 10s ease-in-out infinite alternate; }
                .about-orb-2 { animation: aboutFloat 13s ease-in-out infinite alternate-reverse; }
                @media (prefers-reduced-motion: reduce) {
                    .about-orb-1, .about-orb-2 { animation: none; }
                }
            `}</style>

            <div className="relative w-full space-y-8">
                <div
                    className="about-orb-1 pointer-events-none absolute -left-20 -top-16 z-[-1] h-64 w-64 rounded-full opacity-20 blur-3xl"
                    style={{ background: 'var(--accent)' }}
                    aria-hidden="true"
                />
                <div
                    className="about-orb-2 pointer-events-none absolute -right-16 bottom-0 z-[-1] h-56 w-56 rounded-full opacity-15 blur-3xl"
                    style={{ background: 'color-mix(in srgb, var(--accent) 55%, #7c3aed)' }}
                    aria-hidden="true"
                />

                <motion.div
                    className="space-y-3 text-center"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={fadeUp}
                >
                    <h2 className="text-3xl font-semibold sm:text-4xl">
                        <span
                            className="bg-clip-text text-transparent"
                            style={{ backgroundImage: 'linear-gradient(135deg, var(--text-h), var(--accent))' }}
                        >
                            {t('about.title')}
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-sm leading-6 text-[var(--text-muted)] sm:text-base">
                        {t('about.intro')}
                    </p>
                </motion.div>

                <motion.div
                    className="grid items-stretch gap-5 md:grid-cols-3"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={containerVariants}
                >
                    <motion.article
                        variants={fadeUp}
                        className="rounded-3xl border border-[var(--border)] bg-[var(--surface-card)] p-6 shadow-[var(--shadow)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-[color:color-mix(in_srgb,var(--accent)_30%,transparent)] hover:[box-shadow:0_8px_24px_color-mix(in_srgb,var(--accent)_15%,transparent)]"
                    >
                        <Article
                            icon={GraduationCap}
                            kicker={t('about.kicker.student')}
                            title={t('about.studentTitle')}
                            body={student}
                        />
                    </motion.article>

                    <motion.article
                        variants={fadeUp}
                        className="rounded-3xl border border-[var(--border)] bg-[var(--surface-card)] p-6 shadow-[var(--shadow)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-[color:color-mix(in_srgb,var(--accent)_30%,transparent)] hover:[box-shadow:0_8px_24px_color-mix(in_srgb,var(--accent)_15%,transparent)]"
                    >
                        <Article
                            icon={UserRound}
                            kicker={t('about.kicker.person')}
                            title={t('about.personTitle')}
                            body={person}
                        />
                    </motion.article>

                    <motion.article
                        variants={fadeUp}
                        className="rounded-3xl border border-[var(--border)] bg-[var(--surface-card)] p-6 shadow-[var(--shadow)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-[color:color-mix(in_srgb,var(--accent)_30%,transparent)] hover:[box-shadow:0_8px_24px_color-mix(in_srgb,var(--accent)_15%,transparent)]"
                    >
                        <Article
                            icon={Gamepad2}
                            kicker={t('about.kicker.leisure')}
                            title={t('about.leisureTitle')}
                            body={leisure}
                        />
                    </motion.article>
                </motion.div>
            </div>
        </IndexLayout>
    );
}
