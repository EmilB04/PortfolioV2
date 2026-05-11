
import { useTranslation } from 'react-i18next'
import { ArrowRight, Lock } from 'lucide-react'
import IndexLayout from './_layout'
import { resolveMediaUrl } from '../../lib/media'

const showcasePreviewImage = resolveMediaUrl('/images/projects/SpillArena/spillarena-preview.jpeg', {
    transformations: ['f_auto', 'q_auto'],
})

const showcaseLogoImage = resolveMediaUrl('/images/projects/SpillArena/logo.png', {
    transformations: ['f_auto', 'q_auto'],
})

export default function LiveDomainShowcase() {
    const { t } = useTranslation()
    const tags = t('showcase.tags', { returnObjects: true }) as string[]

    return (
        <IndexLayout id="live-projects" fullscreen>
            <style>{`
                @keyframes float {
                    from {
                        transform: translateY(0px) rotate(0deg);
                    }
                    to {
                        transform: translateY(-20px) rotate(15deg);
                    }
                }

                @keyframes float-mockup {
                    from {
                        transform: translateY(0px) rotate(-0.5deg);
                    }
                    to {
                        transform: translateY(-12px) rotate(0.5deg);
                    }
                }

                @keyframes pulse-dot {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.4;
                        transform: scale(0.7);
                    }
                }

                .float-1 { animation: float 8s ease-in-out infinite alternate; }
                .float-2 { animation: float 11s ease-in-out infinite alternate-reverse; }
                .float-3 { animation: float 9s ease-in-out infinite alternate; }
                .float-4 { animation: float 13s ease-in-out infinite alternate-reverse; }
                .float-5 { animation: float 10s ease-in-out infinite alternate; }
                .float-mockup { animation: float-mockup 6s ease-in-out infinite alternate; }
                .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
            `}</style>

            <div className="relative w-screen h-screen overflow-hidden">
                {/* Blurred background */}
                <div
                    className="absolute inset-0 z-0 w-screen h-screen"
                    style={{
                        backgroundImage: `url(${showcasePreviewImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(18px) saturate(1.4)',
                        transform: 'scale(1.08)',
                    }}
                />

                {/* Dark overlay */}
                <div
                    className="absolute inset-0 z-1"
                    style={{
                        background: 'linear-gradient(135deg, rgba(10, 5, 25, 0.92) 0%, rgba(40, 10, 60, 0.85) 50%, rgba(10, 5, 25, 0.92) 100%)',
                    }}
                />

                {/* Decorative circle 1 */}
                <div
                    className="absolute z-2 float-1 pointer-events-none opacity-15"
                    style={{
                        width: '180px',
                        height: '180px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, #aa00ff, #ff2d78)',
                        top: '-60px',
                        right: '8%',
                    }}
                />

                {/* Decorative circle 2 */}
                <div
                    className="absolute z-2 float-2 pointer-events-none opacity-15"
                    style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, #ff2d78, #aa00ff)',
                        bottom: '10%',
                        left: '5%',
                    }}
                />

                {/* Decorative plus 1 */}
                <div
                    className="absolute z-2 float-3 pointer-events-none opacity-15 text-[#cc44ff]"
                    style={{
                        fontSize: '3rem',
                        top: '12%',
                        left: '3%',
                    }}
                >
                    +
                </div>

                {/* Decorative plus 2 */}
                <div
                    className="absolute z-2 float-4 pointer-events-none opacity-15 text-[#cc44ff]"
                    style={{
                        fontSize: '2rem',
                        bottom: '15%',
                        right: '4%',
                    }}
                >
                    +
                </div>

                {/* Decorative times */}
                <div
                    className="absolute z-2 float-5 pointer-events-none opacity-15 text-[#cc44ff]"
                    style={{
                        fontSize: '2.5rem',
                        top: '55%',
                        left: '1.5%',
                    }}
                >
                    ×
                </div>

                {/* Content wrapper */}
                <div className="relative z-3 w-full h-full flex flex-col md:flex-row items-center justify-center gap-16 px-8 py-16 md:px-12 md:py-20">
                    {/* Left side */}
                    <div className="flex-1 flex flex-col gap-4 text-white">
                        {/* Logo */}
                        <img
                            src={showcaseLogoImage}
                            alt={t('showcase.logoAlt')}
                            className="w-18 h-18 object-contain rounded-lg shadow-[0_0_24px_rgba(170,0,255,0.4)]"
                            loading="eager"
                        />

                        {/* Title and status */}
                        <div className="flex items-center gap-4">
                            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#cc44ff] to-[#ff2d78] bg-clip-text text-transparent">
                                {t('showcase.title')}
                            </h2>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-green-400 bg-green-400/10 border border-green-400/35">
                                <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-green-400" />
                                {t('showcase.status')}
                            </div>
                        </div>

                        {/* URL */}
                        <p className="text-sm text-white opacity-45 tracking-wider">{t('showcase.url')}</p>

                        {/* Description */}
                        <p className="text-lg text-white leading-relaxed opacity-82 max-w-md">
                            {t('showcase.description')}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((tag) => (
                                <span key={tag} className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-[#cc44ff]/15 border border-[#cc44ff]/35 text-[#e0aaff]">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Visit button */}
                        <a
                            href="https://spillarena.no"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 mt-4 px-7 py-3 rounded-full font-bold text-white bg-gradient-to-r from-[#aa00ff] to-[#ff2d78] shadow-[0_4px_20px_rgba(170,0,255,0.45)] hover:shadow-[0_8px_32px_rgba(170,0,255,0.65)] transition-all duration-200 hover:-translate-y-1 w-fit"
                        >
                            {t('showcase.visit')}
                            <ArrowRight size={18} />
                        </a>
                    </div>

                    {/* Right side - Browser mockup */}
                    <div className="flex-1.1 w-full md:w-auto flex justify-center">
                        <div
                            className="float-mockup w-full max-w-[640px] rounded-2xl overflow-hidden"
                            style={{
                                boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.08), 0 24px 60px rgba(0, 0, 0, 0.6), 0 0 60px rgba(170, 0, 255, 0.2)',
                            }}
                        >
                            {/* Browser bar */}
                            <div className="flex items-center gap-3 px-4 py-3 bg-[#1e1e2e] border-b border-white/5">
                                <div className="flex gap-2 flex-shrink-0">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                                </div>
                                <div className="flex-1 flex items-center justify-center gap-2 px-3 py-1 text-xs text-white/45 bg-white/5 rounded-full tracking-wide" title={t('showcase.browserLabel')}>
                                    <Lock size={13} className="opacity-60" />
                                    {t('showcase.url')}
                                </div>
                            </div>

                            {/* Browser content */}
                            <div className="bg-[#0d0d1a]">
                                <img
                                    src={showcasePreviewImage}
                                    alt={t('showcase.previewAlt')}
                                    className="w-full block object-cover"
                                    loading="eager"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </IndexLayout>
    )
}