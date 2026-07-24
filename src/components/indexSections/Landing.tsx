
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowDown, Code2, Github, Linkedin } from 'lucide-react'
import IndexLayout from './_layout'

const GITHUB_USER = 'EmilB04'

type LandingProps = {
    shouldUseAos?: boolean
    onScrollNextSection?: () => void
}

type TypewriterProps = {
    lines: string[]
}

function Typewriter({ lines }: TypewriterProps) {
    const [lineIndex, setLineIndex] = useState(0)
    const [typewriterText, setTypewriterText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const currentLine = lines[lineIndex]
        let timeoutMs = isDeleting ? 40 : 80

        if (!isDeleting && typewriterText === currentLine) {
            timeoutMs = 1800
        }

        if (isDeleting && typewriterText === '') {
            timeoutMs = 400
        }

        const timeoutId = setTimeout(() => {
            if (!isDeleting) {
                if (typewriterText === currentLine) {
                    setIsDeleting(true)
                    return
                }

                setTypewriterText(currentLine.substring(0, typewriterText.length + 1))
                return
            }

            if (typewriterText === '') {
                setIsDeleting(false)
                setLineIndex((current) => (current + 1) % lines.length)
                return
            }

            setTypewriterText(currentLine.substring(0, Math.max(0, typewriterText.length - 1)))
        }, timeoutMs)

        return () => clearTimeout(timeoutId)
    }, [isDeleting, lineIndex, lines, typewriterText])

    return (
        <span className="inline-block px-0 py-2 text-[var(--accent)]" style={{ minWidth: '18ch' }}>
            {typewriterText}
            <span className="ml-1 inline-block animate-[blink_0.7s_step-end_infinite] text-[var(--accent)]">|</span>
        </span>
    )
}

function AvatarPortrait() {
    const [failed, setFailed] = useState(false)

    return (
        <div className="relative mx-auto flex h-48 w-48 flex-shrink-0 items-center justify-center md:h-56 md:w-56">
            {/* Slow-spinning gradient ring */}
            <div
                className="absolute inset-0 animate-spin rounded-full opacity-80 [animation-duration:9s]"
                style={{
                    background: `conic-gradient(from 0deg, var(--accent), transparent 35%, transparent 65%, var(--accent))`,
                }}
                aria-hidden="true"
            />

            {/* Pulsing glow */}
            <div
                className="absolute inset-2 animate-pulse rounded-full blur-xl [animation-duration:3s]"
                style={{ background: 'color-mix(in srgb, var(--accent) 45%, transparent)' }}
                aria-hidden="true"
            />

            {failed ? (
                <div
                    className="relative flex h-[calc(100%-14px)] w-[calc(100%-14px)] items-center justify-center rounded-full text-4xl font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 40%, #7c3aed))' }}
                >
                    EB
                </div>
            ) : (
                <img
                    src={`https://github.com/${GITHUB_USER}.png`}
                    alt="Emil Berglund"
                    onError={() => setFailed(true)}
                    loading="eager"
                    className="relative h-[calc(100%-14px)] w-[calc(100%-14px)] rounded-full object-cover"
                    style={{ boxShadow: '0 0 0 4px var(--bg)' }}
                />
            )}

            {/* Decorative code badge */}
            <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 18 }}
                className="absolute -bottom-1 -right-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] shadow-lg"
                style={{ background: 'var(--surface-card)', backdropFilter: 'blur(8px)' }}
                aria-hidden="true"
            >
                <Code2 size={20} className="text-[var(--accent)]" />
            </motion.div>
        </div>
    )
}

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
}

export default function Landing({ shouldUseAos = false, onScrollNextSection }: LandingProps) {
    const { t, i18n } = useTranslation()
    const typewriterLines = t('home.roles', { returnObjects: true }) as string[]

    function handleScrollNextSection() {
        if (onScrollNextSection) {
            onScrollNextSection()
            return
        }

        document.getElementById('next-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <IndexLayout id="landing" className="text-left">
            <style>{`
                @keyframes heroFloat {
                    from { transform: translate(0, 0); }
                    to { transform: translate(-16px, -26px); }
                }
                .hero-orb-1 { animation: heroFloat 9s ease-in-out infinite alternate; }
                .hero-orb-2 { animation: heroFloat 12s ease-in-out infinite alternate-reverse; }
                @media (prefers-reduced-motion: reduce) {
                    .hero-orb-1, .hero-orb-2 { animation: none; }
                }
            `}</style>

            <section className="about-me relative w-full max-w-screen-xl">
                {/* Ambient background glow */}
                <div
                    className="hero-orb-1 pointer-events-none absolute -left-24 -top-24 z-[-1] h-72 w-72 rounded-full opacity-25 blur-3xl"
                    style={{ background: 'var(--accent)' }}
                    aria-hidden="true"
                />
                <div
                    className="hero-orb-2 pointer-events-none absolute -right-16 bottom-0 z-[-1] h-64 w-64 rounded-full opacity-20 blur-3xl"
                    style={{ background: 'color-mix(in srgb, var(--accent) 60%, #7c3aed)' }}
                    aria-hidden="true"
                />

                <div className="flex flex-col-reverse items-center gap-10 md:flex-row md:items-center md:justify-between md:gap-16">
                    <motion.div
                        className="w-full md:flex-1"
                        initial="hidden"
                        animate="show"
                        variants={{ show: { transition: { staggerChildren: 0.12 } } }}
                    >
                        <motion.h1
                            variants={fadeUp}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            style={{ background: 'none' }}
                            className="mb-8 text-4xl font-semibold leading-tight text-[var(--text-h)] md:text-6xl"
                        >
                            <span
                                className="bg-clip-text text-transparent"
                                style={{ backgroundImage: 'linear-gradient(135deg, var(--text-h), var(--accent))' }}
                            >
                                {t('home.title')}
                            </span>
                            <br />
                            <Typewriter key={i18n.language} lines={typewriterLines} />
                        </motion.h1>

                        <motion.p
                            variants={fadeUp}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="mb-10 max-w-5xl text-lg leading-relaxed md:text-2xl"
                        >
                            {t('home.intro')}
                        </motion.p>

                        <motion.div
                            variants={fadeUp}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="mb-8 flex flex-wrap items-center gap-4"
                        >
                            <a
                                href="https://github.com/EmilB04"
                                target="_blank"
                                rel="noreferrer"
                                aria-label={t('home.githubAria')}
                                className="inline-flex h-12 w-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-white text-black transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent)] hover:text-white"
                            >
                                <Github size={28} />
                            </a>

                            <a
                                href="https://www.linkedin.com/in/emilber/"
                                target="_blank"
                                rel="noreferrer"
                                aria-label={t('home.linkedinAria')}
                                className="inline-flex h-12 w-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-white text-black transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent)] hover:text-white"
                            >
                                <Linkedin size={28} />
                            </a>
                        </motion.div>

                        <motion.button
                            variants={fadeUp}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            type="button"
                            onClick={handleScrollNextSection}
                            data-aos={shouldUseAos ? 'zoom-in-up' : undefined}
                            data-aos-delay={shouldUseAos ? '0' : undefined}
                            data-aos-duration={shouldUseAos ? '1500' : undefined}
                            className="inline-flex items-center gap-4 rounded-3xl bg-[var(--accent)] px-10 py-5 text-xl font-semibold text-black transition-opacity duration-200 hover:opacity-90"
                        >
                            <ArrowDown className="h-7 w-7 animate-bounce" />
                            {t('home.cta')}
                        </motion.button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
                    >
                        <AvatarPortrait />
                    </motion.div>
                </div>
            </section>
        </IndexLayout>
    )
}
