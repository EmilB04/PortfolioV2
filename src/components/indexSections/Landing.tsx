
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowDown, Github, Linkedin } from 'lucide-react'
import IndexLayout from './_layout'

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
        <span className="inline-block px-0 py-2 text-[var(--text-h)]" style={{ minWidth: '18ch' }}>
            {typewriterText}
            <span className="ml-1 inline-block animate-[blink_0.7s_step-end_infinite] text-[var(--accent)]">|</span>
        </span>
    )
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
        <IndexLayout id="landing" className={"text-left"}>
            <section className="about-me w-full max-w-4xl">
                <h1 className="mb-8 text-4xl font-semibold leading-tight text-[var(--text-h)] sm:text-5xl lg:text-6xl">
                    {t('home.title')} <br />
                    <Typewriter key={i18n.language} lines={typewriterLines} />
                </h1>

                <p className="mb-10 max-w-5xl text-lg leading-relaxed sm:text-2xl">
                    {t('home.intro')}
                </p>

                <div className="mb-8 flex flex-wrap items-center gap-4">
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
                </div>

                <button
                    type="button"
                    onClick={handleScrollNextSection}
                    data-aos={shouldUseAos ? 'zoom-in-up' : undefined}
                    data-aos-delay={shouldUseAos ? '0' : undefined}
                    data-aos-duration={shouldUseAos ? '1500' : undefined}
                    className="inline-flex items-center gap-4 rounded-3xl bg-[var(--accent)] px-10 py-5 text-xl font-semibold text-black transition-opacity duration-200 hover:opacity-90"
                >
                    <ArrowDown className="h-7 w-7 animate-bounce" />
                    {t('home.cta')}
                </button>
            </section>
        </IndexLayout>
    )
}