
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, Github, Linkedin } from 'lucide-react'
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
        <span className="text-[var(--accent-text)]">
            {typewriterText}
            <span
                className="ml-[3px] inline-block h-[0.78em] w-[3px] translate-y-[1px] animate-[blink_0.9s_step-end_infinite] rounded-full align-baseline"
                style={{ background: 'var(--accent-text)' }}
                aria-hidden="true"
            />
        </span>
    )
}

/**
 * The portrait is cut as a weathered stone rather than a circle: an
 * irregular radius that slowly settles between two shapes, ringed by a
 * single hand-drawn contour line that sits slightly off-register.
 */
function AvatarPortrait() {
    const [failed, setFailed] = useState(false)

    return (
        <div className="relative h-56 w-56 shrink-0 md:h-[19rem] md:w-[19rem]">
            <style>{`
                @keyframes stoneSettle {
                    0%   { border-radius: 66% 34% 48% 52% / 36% 62% 38% 64%; }
                    50%  { border-radius: 42% 58% 63% 37% / 58% 39% 61% 42%; }
                    100% { border-radius: 66% 34% 48% 52% / 36% 62% 38% 64%; }
                }
                .stone { animation: stoneSettle 22s ease-in-out infinite; }
                .stone-ring { animation: stoneSettle 22s ease-in-out infinite reverse; }
                @media (prefers-reduced-motion: reduce) {
                    .stone, .stone-ring { animation: none; }
                }
            `}</style>

            {/* Contour ring, rotated a few degrees out of alignment. */}
            <div
                className="stone-ring pointer-events-none absolute -inset-4 rotate-[7deg] border"
                style={{ borderColor: 'var(--border-strong)' }}
                aria-hidden="true"
            />

            {failed ? (
                <div
                    className="stone flex h-full w-full items-center justify-center text-5xl font-semibold text-[var(--on-accent)]"
                    style={{ background: 'var(--accent)' }}
                >
                    EB
                </div>
            ) : (
                <img
                    src={`https://github.com/${GITHUB_USER}.png`}
                    alt="Emil Berglund"
                    onError={() => setFailed(true)}
                    loading="eager"
                    className="stone h-full w-full object-cover"
                    style={{ boxShadow: 'var(--shadow-lifted)' }}
                />
            )}
        </div>
    )
}

export default function Landing({ onScrollNextSection }: LandingProps) {
    const { t, i18n } = useTranslation()
    const prefersReducedMotion = useReducedMotion()
    const typewriterLines = t('home.roles', { returnObjects: true }) as string[]

    function handleScrollNextSection() {
        if (onScrollNextSection) {
            onScrollNextSection()
            return
        }

        document.getElementById('next-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    // The single orchestrated entrance on the site: the hero settles once,
    // and nothing else on the page announces itself this way.
    const rise = {
        hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 18 },
        show: { opacity: 1, y: 0 },
    }

    return (
        <IndexLayout id="landing" className="text-left">
            <section className="about-me flex w-full flex-col justify-center pt-6 md:min-h-[82vh] md:pt-0">
                <motion.div
                    className="flex flex-col-reverse items-start gap-12 md:flex-row md:items-center md:justify-between md:gap-20"
                    initial="hidden"
                    animate="show"
                    variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
                >
                    <div className="w-full md:flex-1">
                        <motion.p
                            variants={rise}
                            transition={{ duration: 0.6, ease: [0.32, 0.72, 0.28, 1] }}
                            className="mb-5 flex items-center gap-3 text-sm text-[var(--text-subtle)]"
                        >
                            <span
                                className="inline-block h-px w-10"
                                style={{ background: 'var(--border-strong)' }}
                                aria-hidden="true"
                            />
                            {t('home.location')}
                        </motion.p>

                        <motion.h1
                            variants={rise}
                            transition={{ duration: 0.6, ease: [0.32, 0.72, 0.28, 1] }}
                            className="mb-6 max-w-[14ch]"
                        >
                            {t('home.title')}
                        </motion.h1>

                        <motion.p
                            variants={rise}
                            transition={{ duration: 0.6, ease: [0.32, 0.72, 0.28, 1] }}
                            className="mb-7 min-h-[1.6em] font-sans text-2xl font-medium md:text-3xl"
                        >
                            <Typewriter key={i18n.language} lines={typewriterLines} />
                        </motion.p>

                        <motion.p
                            variants={rise}
                            transition={{ duration: 0.6, ease: [0.32, 0.72, 0.28, 1] }}
                            className="prose-organic mb-10 text-[var(--text-muted)]"
                        >
                            {t('home.intro')}
                        </motion.p>

                        <motion.div
                            variants={rise}
                            transition={{ duration: 0.6, ease: [0.32, 0.72, 0.28, 1] }}
                            className="flex flex-wrap items-center gap-3"
                        >
                            <button
                                type="button"
                                onClick={handleScrollNextSection}
                                className="pebble-sm group inline-flex items-center gap-3 px-7 py-4 text-base font-semibold text-[var(--on-accent)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0.28,1)] hover:-translate-y-0.5"
                                style={{ background: 'var(--accent)' }}
                            >
                                {t('home.cta')}
                                <ArrowDown
                                    className="h-5 w-5 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0.28,1)] group-hover:translate-y-1"
                                    aria-hidden="true"
                                />
                            </button>

                            <a
                                href="https://github.com/EmilB04"
                                target="_blank"
                                rel="noreferrer"
                                aria-label={t('home.githubAria')}
                                className="pebble-sm inline-flex h-[54px] w-[54px] items-center justify-center border border-[var(--border)] text-[var(--text)] transition-colors duration-300 hover:border-[var(--border-hover)] hover:text-[var(--accent-text)]"
                                style={{ background: 'var(--surface-card)' }}
                            >
                                <Github size={22} aria-hidden="true" />
                            </a>

                            <a
                                href="https://www.linkedin.com/in/emilber/"
                                target="_blank"
                                rel="noreferrer"
                                aria-label={t('home.linkedinAria')}
                                className="pebble-sm inline-flex h-[54px] w-[54px] items-center justify-center border border-[var(--border)] text-[var(--text)] transition-colors duration-300 hover:border-[var(--border-hover)] hover:text-[var(--accent-text)]"
                                style={{ background: 'var(--surface-card)' }}
                            >
                                <Linkedin size={22} aria-hidden="true" />
                            </a>
                        </motion.div>
                    </div>

                    <motion.div
                        variants={rise}
                        transition={{ duration: 0.7, ease: [0.32, 0.72, 0.28, 1] }}
                        className="md:-mt-10"
                    >
                        <AvatarPortrait />
                    </motion.div>
                </motion.div>
            </section>
        </IndexLayout>
    )
}
