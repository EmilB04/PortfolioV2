import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BotMessageSquare, Sparkles } from 'lucide-react'

export default function AIStarterWidget() {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6">
            {isOpen && (
                <div
                    className="mb-3 w-[min(92vw,20rem)] rounded-3xl border p-4 shadow-2xl backdrop-blur-md"
                    style={{
                        background: 'var(--surface)',
                        borderColor: 'var(--border)',
                        color: 'var(--text)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.18)',
                    }}
                >
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>
                        <Sparkles size={14} />
                        {t('aiWidget.assistant')}
                    </div>

                    <h2 className="mb-2 text-lg font-semibold" style={{ color: 'var(--text)' }}>
                        {t('aiWidget.title')}
                    </h2>

                    <p className="mb-4 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>
                        {t('aiWidget.description')}
                    </p>

                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5"
                        style={{
                            background: 'var(--accent)',
                            color: '#fff',
                        }}
                        onClick={() => setIsOpen(false)}
                    >
                        <BotMessageSquare size={16} />
                        {t('aiWidget.close')}
                    </button>
                </div>
            )}

            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                aria-label={isOpen ? t('aiWidget.closed') : t('aiWidget.open')}
                className="group inline-flex items-center gap-3 rounded-full border px-3 py-3 text-left shadow-2xl transition-all duration-200 hover:-translate-y-0.5 sm:px-4"
                style={{
                    background: 'var(--surface)',
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: '0 18px 50px rgba(0, 0, 0, 0.18)',
                }}
            >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'var(--accent)', color: '#fff' }}>
                    <BotMessageSquare size={18} />
                </span>

                <span className="hidden flex-col sm:flex">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>
                        {t('aiWidget.assistant')}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                        {t('aiWidget.teaser')}
                    </span>
                </span>
            </button>
        </div>
    )
}