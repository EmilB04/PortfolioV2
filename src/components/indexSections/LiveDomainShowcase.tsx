
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Lock, ChevronLeft, ChevronRight } from 'lucide-react'
import IndexLayout from './_layout'
import { INDEX_PATHS } from '../../routes/indexPaths'

interface DomainConfig {
    previewImage: string | null
    logoImage: string | null
    href: string
    accentFrom: string
    accentTo: string
}

interface ShowcaseItem {
    title: string
    description: string
    tags: string[]
    url: string
    logoAlt: string
    previewAlt: string
}

const DOMAINS: DomainConfig[] = [
    {
        previewImage: 'https://res.cloudinary.com/emilber-portfolio/image/upload/v1778535404/spillarena-preview_yif14p.jpg',
        logoImage: 'https://res.cloudinary.com/emilber-portfolio/image/upload/v1778535404/logo_qgrwwk.png',
        href: 'https://spillarena.no',
        accentFrom: '#aa00ff',
        accentTo: '#ff2d78',
    },
    {
        previewImage: null,
        logoImage: null,
        href: 'https://tools.emilb.no',
        accentFrom: '#0070f3',
        accentTo: '#00d2ff',
    },
]

export default function LiveDomainShowcase() {
    const { t } = useTranslation()
    const [active, setActive] = useState(0)
    const [paused, setPaused] = useState(false)

    const items = t('showcase.items', { returnObjects: true }) as ShowcaseItem[]
    const domain = DOMAINS[active]
    const item = items[active]

    useEffect(() => {
        if (paused) return
        const interval = setInterval(() => {
            setActive(prev => (prev + 1) % DOMAINS.length)
        }, 6000)
        return () => clearInterval(interval)
    }, [paused])

    function navigate(index: number) {
        setActive(((index % DOMAINS.length) + DOMAINS.length) % DOMAINS.length)
    }

    return (
        <IndexLayout id={INDEX_PATHS.DOMAIN} fullscreen>
            <style>{`
                @keyframes float {
                    from { transform: translateY(0px) rotate(0deg); }
                    to { transform: translateY(-20px) rotate(15deg); }
                }
                @keyframes float-mockup {
                    from { transform: translateY(0px) rotate(-0.5deg); }
                    to { transform: translateY(-12px) rotate(0.5deg); }
                }
                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(0.7); }
                }
                .float-1 { animation: float 8s ease-in-out infinite alternate; }
                .float-2 { animation: float 11s ease-in-out infinite alternate-reverse; }
                .float-3 { animation: float 9s ease-in-out infinite alternate; }
                .float-4 { animation: float 13s ease-in-out infinite alternate-reverse; }
                .float-5 { animation: float 10s ease-in-out infinite alternate; }
                .float-mockup { animation: float-mockup 6s ease-in-out infinite alternate; }
                .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
            `}</style>

            <div
                className="relative w-screen h-screen overflow-hidden"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                {/* Backgrounds — cross-fade per domain */}
                {DOMAINS.map((d, i) =>
                    d.previewImage ? (
                        <div
                            key={i}
                            className="absolute inset-0 z-0 w-screen h-screen transition-opacity duration-700"
                            style={{
                                backgroundImage: `url(${d.previewImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: 'blur(18px) saturate(1.4)',
                                transform: 'scale(1.08)',
                                opacity: active === i ? 1 : 0,
                            }}
                        />
                    ) : (
                        <div
                            key={i}
                            className="absolute inset-0 z-0 transition-opacity duration-700"
                            style={{
                                background: 'linear-gradient(135deg, #050a1e 0%, #00213d 50%, #050a1e 100%)',
                                opacity: active === i ? 1 : 0,
                            }}
                        />
                    )
                )}

                {/* Dark overlay */}
                <div
                    className="absolute inset-0 z-1 transition-all duration-700"
                    style={{
                        background: active === 0
                            ? 'linear-gradient(135deg, rgba(10,5,25,0.92) 0%, rgba(40,10,60,0.85) 50%, rgba(10,5,25,0.92) 100%)'
                            : 'linear-gradient(135deg, rgba(5,10,30,0.92) 0%, rgba(0,20,50,0.85) 50%, rgba(5,10,30,0.92) 100%)',
                    }}
                />

                {/* Decorative circles */}
                <div
                    className="absolute z-2 float-1 pointer-events-none opacity-15 transition-all duration-700"
                    style={{ width: '180px', height: '180px', borderRadius: '50%', background: `radial-gradient(circle, ${domain.accentFrom}, ${domain.accentTo})`, top: '-60px', right: '8%' }}
                />
                <div
                    className="absolute z-2 float-2 pointer-events-none opacity-15 transition-all duration-700"
                    style={{ width: '80px', height: '80px', borderRadius: '50%', background: `radial-gradient(circle, ${domain.accentTo}, ${domain.accentFrom})`, bottom: '10%', left: '5%' }}
                />
                <div className="absolute z-2 float-3 pointer-events-none opacity-15 text-[#cc44ff]" style={{ fontSize: '3rem', top: '12%', left: '3%' }}>+</div>
                <div className="absolute z-2 float-4 pointer-events-none opacity-15 text-[#cc44ff]" style={{ fontSize: '2rem', bottom: '15%', right: '4%' }}>+</div>
                <div className="absolute z-2 float-5 pointer-events-none opacity-15 text-[#cc44ff]" style={{ fontSize: '2.5rem', top: '55%', left: '1.5%' }}>×</div>

                {/* Content */}
                <div className="relative z-3 w-full h-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-16 px-8 py-16">
                    {/* Left */}
                    <div className="flex-1 flex flex-col gap-4 text-white">
                        {domain.logoImage ? (
                            <img
                                src={domain.logoImage}
                                alt={item.logoAlt}
                                className="w-16 h-16 object-contain rounded-lg"
                                style={{ boxShadow: `0 0 24px ${domain.accentFrom}66`, transition: 'box-shadow 0.7s' }}
                                loading="eager"
                            />
                        ) : (
                            <div
                                className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl transition-all duration-700"
                                style={{ background: `linear-gradient(135deg, ${domain.accentFrom}, ${domain.accentTo})`, boxShadow: `0 0 24px ${domain.accentFrom}66` }}
                            >
                                {item.title.charAt(0)}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <h2
                                className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent transition-all duration-700"
                                style={{ backgroundImage: `linear-gradient(to right, ${domain.accentFrom}, ${domain.accentTo})` }}
                            >
                                {item.title}
                            </h2>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-green-400 bg-green-400/10 border border-green-400/35">
                                <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-green-400" />
                                {t('showcase.status')}
                            </div>
                        </div>

                        <p className="text-sm text-white opacity-45 tracking-wider">{item.url}</p>

                        <p className="text-lg text-white leading-relaxed opacity-82 max-w-md">{item.description}</p>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {item.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border transition-all duration-700"
                                    style={{ background: `${domain.accentFrom}26`, borderColor: `${domain.accentFrom}59`, color: '#e0aaff' }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <a
                            href={domain.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 mt-4 px-7 py-3 rounded-full font-bold text-white transition-all duration-200 hover:-translate-y-1 w-fit"
                            style={{ background: `linear-gradient(to right, ${domain.accentFrom}, ${domain.accentTo})`, boxShadow: `0 4px 20px ${domain.accentFrom}73` }}
                        >
                            {t('showcase.visit')}
                            <ArrowRight size={18} />
                        </a>
                    </div>

                    {/* Right — browser mockup */}
                    <div className="flex-1 w-full md:w-auto flex justify-center">
                        <div
                            className="float-mockup w-full max-w-[640px] rounded-2xl overflow-hidden transition-all duration-700"
                            style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.6), 0 0 60px ${domain.accentFrom}33` }}
                        >
                            <div className="flex items-center gap-3 px-4 py-3 bg-[#1e1e2e] border-b border-white/5">
                                <div className="flex gap-2 flex-shrink-0">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                                </div>
                                <div className="flex-1 flex items-center justify-center gap-2 px-3 py-1 text-xs text-white/45 bg-white/5 rounded-full tracking-wide">
                                    <Lock size={13} className="opacity-60" />
                                    {item.url}
                                </div>
                            </div>
                            <div className="bg-[#0d0d1a]">
                                {domain.previewImage ? (
                                    <img
                                        src={domain.previewImage}
                                        alt={item.previewAlt}
                                        className="w-full block object-cover"
                                        loading="eager"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-64 flex items-center justify-center text-white/20 text-sm tracking-wider"
                                        style={{ background: `linear-gradient(135deg, ${domain.accentFrom}22, ${domain.accentTo}22)` }}
                                    >
                                        {item.url}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Prev / Next */}
                <button
                    onClick={() => navigate(active - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all"
                    aria-label={t('showcase.prev')}
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={() => navigate(active + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all"
                    aria-label={t('showcase.next')}
                >
                    <ChevronRight size={20} />
                </button>

                {/* Dots */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2 items-center">
                    {DOMAINS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(i)}
                            className="rounded-full transition-all duration-300"
                            style={{
                                width: active === i ? '24px' : '8px',
                                height: '8px',
                                background: active === i
                                    ? `linear-gradient(to right, ${domain.accentFrom}, ${domain.accentTo})`
                                    : 'rgba(255,255,255,0.3)',
                            }}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </IndexLayout>
    )
}
