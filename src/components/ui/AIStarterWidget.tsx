import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BotMessageSquare, RotateCcw, Send, X } from 'lucide-react'

type Message = { role: 'user' | 'assistant'; content: string }

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`
const STORAGE_KEY = 'ai_chat_messages'

export default function AIStarterWidget() {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            return saved ? (JSON.parse(saved) as Message[]) : []
        } catch {
            return []
        }
    })
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    useEffect(() => {
        if (isOpen) inputRef.current?.focus()
    }, [isOpen])

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
        } catch {
            // ignore storage errors
        }
    }, [messages])

    function newChat() {
        setMessages([])
        localStorage.removeItem(STORAGE_KEY)
    }

    async function send() {
        const text = input.trim()
        if (!text || loading) return

        const next: Message[] = [...messages, { role: 'user', content: text }]
        setMessages(next)
        setInput('')
        setLoading(true)

        try {
            const res = await fetch(CHAT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: next }),
            })
            const data = await res.json()
            setMessages([...next, { role: 'assistant', content: data.message ?? t('aiWidget.error') }])
        } catch {
            setMessages([...next, { role: 'assistant', content: t('aiWidget.error') }])
        } finally {
            setLoading(false)
        }
    }

    function handleKey(e: React.KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            void send()
        }
    }

    return (
        <div className="fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6">
            {isOpen && (
                <div
                    className="mb-3 flex w-[min(92vw,22rem)] flex-col overflow-hidden rounded-3xl border shadow-2xl"
                    style={{
                        background: 'var(--bg)',
                        borderColor: 'var(--border)',
                        color: 'var(--text)',
                        height: '28rem',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    }}
                >
                    {/* header */}
                    <div
                        className="flex shrink-0 items-center justify-between px-4 py-3"
                        style={{ borderBottom: '1px solid var(--border)' }}
                    >
                        <div className="flex items-center gap-2">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full" style={{ background: 'var(--accent)', color: '#fff' }}>
                                <BotMessageSquare size={14} />
                            </span>
                            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                                {t('aiWidget.assistant')}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={newChat}
                                aria-label={t('aiWidget.newChat')}
                                title={t('aiWidget.newChat')}
                                className="rounded-full p-1.5 transition-colors hover:bg-[var(--surface-card)]"
                            >
                                <RotateCcw size={14} style={{ color: 'var(--text-muted)' }} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                aria-label={t('aiWidget.close')}
                                title={t('aiWidget.close')}
                                className="rounded-full p-1.5 transition-colors hover:bg-[var(--surface-card)]"
                            >
                                <X size={16} style={{ color: 'var(--text-muted)' }} />
                            </button>
                        </div>
                    </div>

                    {/* messages */}
                    <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-3">
                        {/* welcome — reactive to language changes */}
                        <div className="flex justify-start">
                            <div className="max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed" style={{ background: 'var(--surface-card)', color: 'var(--text)' }}>
                                {t('aiWidget.welcome')}
                            </div>
                        </div>
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className="max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed"
                                    style={
                                        msg.role === 'user'
                                            ? { background: 'var(--accent)', color: '#000' }
                                            : { background: 'var(--surface-card)', color: 'var(--text)' }
                                    }
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="rounded-2xl px-3 py-2 text-sm" style={{ background: 'var(--surface-card)', color: 'var(--text-muted)' }}>
                                    {t('aiWidget.thinking')}
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* disclaimer */}
                    <div className="shrink-0 px-4 py-1 text-center text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {t('aiWidget.disclaimer')}
                    </div>

                    {/* input */}
                    <div
                        className="flex shrink-0 items-center gap-2 px-3 py-3"
                        style={{ borderTop: '1px solid var(--border)' }}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            placeholder={t('aiWidget.placeholder')}
                            disabled={loading}
                            className="flex-1 rounded-full border px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--accent)] disabled:opacity-50"
                            style={{
                                background: 'var(--surface-card)',
                                borderColor: 'var(--border)',
                                color: 'var(--text)',
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => void send()}
                            disabled={!input.trim() || loading}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-all hover:scale-105 disabled:opacity-40"
                            style={{ background: 'var(--accent)', color: '#000' }}
                        >
                            <Send size={14} />
                            {t('aiWidget.send')}
                        </button>
                    </div>
                </div>
            )}

            {/* toggle button */}
            <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                aria-label={isOpen ? t('aiWidget.closed') : t('aiWidget.open')}
                className="group inline-flex items-center gap-3 rounded-full border px-3 py-3 text-left shadow-2xl transition-all duration-200 hover:-translate-y-0.5 sm:px-4"
                style={{
                    background: 'var(--surface)',
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: '0 18px 50px rgba(0,0,0,0.18)',
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
