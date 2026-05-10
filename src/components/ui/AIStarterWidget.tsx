import { useState } from 'react'
import { BotMessageSquare, Sparkles } from 'lucide-react'

export default function AIStarterWidget() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6">
            {isOpen && (
                <div
                    className="mb-3 w-[min(92vw,20rem)] rounded-3xl border p-4 shadow-2xl backdrop-blur-md"
                    style={{
                        background: 'var(--c-surface)',
                        borderColor: 'var(--c-border)',
                        color: 'var(--c-text)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.18)',
                    }}
                >
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--c-text-muted)' }}>
                        <Sparkles size={14} />
                        AI assistant
                    </div>

                    <h2 className="mb-2 text-lg font-semibold" style={{ color: 'var(--c-text)' }}>
                        Starter widget
                    </h2>

                    <p className="mb-4 text-sm leading-6" style={{ color: 'var(--c-text-muted)' }}>
                        This space is prepared for a future personal AI assistant. Later you can connect it to GPT-4.3,
                        add portfolio knowledge, and turn this panel into a chat experience.
                    </p>

                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5"
                        style={{
                            background: 'var(--c-accent)',
                            color: '#fff',
                        }}
                        onClick={() => setIsOpen(false)}
                    >
                        <BotMessageSquare size={16} />
                        Close
                    </button>
                </div>
            )}

            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                aria-label={isOpen ? 'Close AI starter widget' : 'Open AI starter widget'}
                className="group inline-flex items-center gap-3 rounded-full border px-3 py-3 text-left shadow-2xl transition-all duration-200 hover:-translate-y-0.5 sm:px-4"
                style={{
                    background: 'var(--c-surface)',
                    borderColor: 'var(--c-border)',
                    color: 'var(--c-text)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: '0 18px 50px rgba(0, 0, 0, 0.18)',
                }}
            >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'var(--c-accent)', color: '#fff' }}>
                    <BotMessageSquare size={18} />
                </span>

                <span className="hidden flex-col sm:flex">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--c-text-muted)' }}>
                        AI assistant
                    </span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>
                        Ask me later
                    </span>
                </span>
            </button>
        </div>
    )
}