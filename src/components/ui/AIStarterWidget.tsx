import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    ArrowDown,
    BotMessageSquare,
    Check,
    Copy,
    Maximize2,
    Minimize2,
    ArrowUpRight,
    RotateCcw,
    Send,
    Square,
    X,
} from 'lucide-react'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { AI_ACTIONS, actionHref, sanitizeActions } from '../../lib/aiActions'
import type { AiActionId } from '../../lib/aiActions'

type Message = { role: 'user' | 'assistant'; content: string; actions?: AiActionId[] }

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`
// Read straight from env rather than importing lib/supabase — that import would pull
// the whole supabase-js chunk into the main bundle instead of its own lazy chunk.
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''
const STORAGE_KEY = 'ai_chat_messages'
const MAX_INPUT_CHARS = 2000
const TEXTAREA_MAX_HEIGHT = 120
// Tailwind's `md` breakpoint in tailwind.config.cjs — the panel goes full screen below it.
const DESKTOP_QUERY = '(min-width: 1024px)'
const SUGGESTION_KEYS = ['s1', 's2', 's3', 's4'] as const
// How long to keep looking for a landing-page section after navigating to it — the page
// is lazy-loaded, so its sections do not exist on the first frames after the route change.
const SECTION_SCROLL_TIMEOUT = 2500

export default function AIStarterWidget() {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const [messages, setMessages] = useState<Message[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (!saved) return []
            // Re-validate action ids on load — stored state is as replaceable as any other input.
            return (JSON.parse(saved) as Message[]).map((msg) => ({
                role: msg.role,
                content: msg.content,
                actions: sanitizeActions(msg.actions),
            }))
        } catch {
            return []
        }
    })
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [failed, setFailed] = useState(false)
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
    const [atBottom, setAtBottom] = useState(true)
    const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches)
    const [mobileHeight, setMobileHeight] = useState<number | null>(null)
    const [pendingSection, setPendingSection] = useState<string | null>(null)

    const navigate = useNavigate()
    const location = useLocation()

    const bottomRef = useRef<HTMLDivElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const abortRef = useRef<AbortController | null>(null)

    useFocusTrap(isOpen, panelRef, { initialFocusRef: inputRef })

    /* ─── scrolling ──────────────────────────────────────── */
    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
        bottomRef.current?.scrollIntoView({ behavior, block: 'end' })
    }, [])

    // Only follow new content when the user is already reading the latest message —
    // yanking them down mid-scroll-back is worse than a stale view.
    useEffect(() => {
        if (atBottom) scrollToBottom()
    }, [messages, loading, failed, atBottom, scrollToBottom])

    function handleScroll() {
        const el = scrollRef.current
        if (!el) return
        setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 48)
    }

    /* ─── viewport ───────────────────────────────────────── */
    useEffect(() => {
        const mq = window.matchMedia(DESKTOP_QUERY)
        const onChange = () => setIsDesktop(mq.matches)
        mq.addEventListener('change', onChange)
        return () => mq.removeEventListener('change', onChange)
    }, [])

    // Below `md` the panel fills the screen, and a fixed element sized to the layout
    // viewport ends up behind the on-screen keyboard. visualViewport tracks the space
    // that is actually visible, so the composer stays reachable while typing.
    useEffect(() => {
        if (isDesktop || !isOpen) return
        const vv = window.visualViewport
        const update = () => setMobileHeight(vv ? vv.height : window.innerHeight)
        update()
        vv?.addEventListener('resize', update)
        vv?.addEventListener('scroll', update)
        window.addEventListener('resize', update)
        return () => {
            vv?.removeEventListener('resize', update)
            vv?.removeEventListener('scroll', update)
            window.removeEventListener('resize', update)
        }
    }, [isDesktop, isOpen])

    /* ─── open/close side effects ────────────────────────── */
    useEffect(() => {
        if (!isOpen) return

        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setIsOpen(false)
        }
        window.addEventListener('keydown', onKey)

        // The panel covers the viewport below `md`, so the page behind it must not scroll.
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = isDesktop ? previousOverflow : 'hidden'

        return () => {
            window.removeEventListener('keydown', onKey)
            document.body.style.overflow = previousOverflow
        }
    }, [isOpen, isDesktop])

    useEffect(() => {
        if (isOpen) scrollToBottom('auto')
    }, [isOpen, scrollToBottom])

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
        } catch {
            // ignore storage errors
        }
    }, [messages])

    useEffect(() => () => abortRef.current?.abort(), [])

    /* ─── chat ───────────────────────────────────────────── */
    function newChat() {
        abortRef.current?.abort()
        setMessages([])
        setFailed(false)
        setInput('')
        localStorage.removeItem(STORAGE_KEY)
        resizeTextarea(null)
        inputRef.current?.focus()
    }

    async function request(history: Message[]) {
        setFailed(false)
        setLoading(true)
        setAtBottom(true)

        const controller = new AbortController()
        abortRef.current = controller

        try {
            const res = await fetch(CHAT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Lets the function run with JWT verification enabled instead of --no-verify-jwt.
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'apikey': SUPABASE_ANON_KEY,
                },
                // The function caps history too — trimming here keeps the request under its limit.
                body: JSON.stringify({
                    messages: history.slice(-20).map(({ role, content }) => ({ role, content })),
                }),
                signal: controller.signal,
            })
            const data = await res.json()
            if (res.ok && typeof data?.message === 'string' && data.message) {
                setMessages([
                    ...history,
                    { role: 'assistant', content: data.message, actions: sanitizeActions(data.actions) },
                ])
            } else {
                setFailed(true)
            }
        } catch (err) {
            // An aborted request is a deliberate stop, not a failure worth reporting.
            if (!(err instanceof DOMException && err.name === 'AbortError')) setFailed(true)
        } finally {
            abortRef.current = null
            setLoading(false)
        }
    }

    function ask(text: string) {
        const trimmed = text.trim()
        if (!trimmed || loading) return
        const history: Message[] = [...messages, { role: 'user', content: trimmed }]
        setMessages(history)
        setInput('')
        resizeTextarea(null)
        void request(history)
    }

    function retry() {
        if (loading) return
        void request(messages)
    }

    function stop() {
        abortRef.current?.abort()
    }

    async function copyMessage(content: string, index: number) {
        try {
            await navigator.clipboard.writeText(content)
            setCopiedIndex(index)
            window.setTimeout(() => setCopiedIndex((i) => (i === index ? null : i)), 1500)
        } catch {
            // clipboard unavailable — nothing useful to show
        }
    }

    /* ─── in-site actions ────────────────────────────────── */
    // A section button pressed from another page has to wait for the landing page to
    // mount before its target exists, so the scroll is retried for a few frames.
    useEffect(() => {
        if (!pendingSection || location.pathname !== '/') return

        const deadline = Date.now() + SECTION_SCROLL_TIMEOUT
        let attempts = 0
        let nextAttemptAt = 0

        // The user taking over always wins — never fight their scrolling.
        const cancel = () => setPendingSection(null)

        // The landing page grows as its sections mount, so a single scroll lands short:
        // keep correcting until the section is actually at the top or time runs out.
        const timer = window.setInterval(() => {
            const el = document.getElementById(pendingSection)
            if (!el) {
                if (Date.now() > deadline) setPendingSection(null)
                return
            }

            if (Math.abs(el.getBoundingClientRect().top) < 8 || Date.now() > deadline) {
                setPendingSection(null)
                return
            }

            // Let the first (animated) scroll finish before correcting for layout growth.
            if (Date.now() < nextAttemptAt) return
            el.scrollIntoView({ behavior: attempts === 0 ? 'smooth' : 'auto', block: 'start' })
            nextAttemptAt = Date.now() + (attempts === 0 ? 700 : 0)
            attempts++
        }, 100)

        window.addEventListener('wheel', cancel, { passive: true })
        window.addEventListener('touchstart', cancel, { passive: true })
        window.addEventListener('keydown', cancel)

        return () => {
            window.clearInterval(timer)
            window.removeEventListener('wheel', cancel)
            window.removeEventListener('touchstart', cancel)
            window.removeEventListener('keydown', cancel)
        }
    }, [pendingSection, location.pathname])

    function runAction(e: React.MouseEvent, id: AiActionId) {
        // Leave modified clicks (new tab, new window) to the browser.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()

        const { target } = AI_ACTIONS[id]
        if (target.kind === 'route') {
            navigate(target.path)
        } else if (location.pathname === '/') {
            document.getElementById(target.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
            navigate('/')
            setPendingSection(target.id)
        }

        // The panel covers the whole screen on mobile — leaving it open hides the destination.
        if (!isDesktop) setIsOpen(false)
    }

    /* ─── input ──────────────────────────────────────────── */
    function resizeTextarea(el: HTMLTextAreaElement | null) {
        const node = el ?? inputRef.current
        if (!node) return
        node.style.height = 'auto'
        node.style.height = `${Math.min(node.scrollHeight, TEXTAREA_MAX_HEIGHT)}px`
    }

    function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            ask(input)
        }
    }

    const isEmpty = messages.length === 0
    const canSend = input.trim().length > 0 && !loading
    const showCounter = input.length > MAX_INPUT_CHARS * 0.8

    const panelSize = expanded
        ? 'md:h-[calc(100dvh-6rem)] md:w-[min(30rem,calc(100vw-3rem))]'
        : 'md:h-[min(30rem,calc(100dvh-9rem))] md:w-[20rem]'

    return (
        <>
            {/* mobile backdrop — the panel is full screen below `md` */}
            {isOpen && (
                <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-40 cursor-default rounded-none p-0 md:hidden"
                    style={{ background: 'var(--backdrop)' }}
                />
            )}

            <div className="fixed bottom-4 left-4 z-40 md:bottom-6 md:left-6">
                {isOpen && (
                    <div
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label={t('aiWidget.assistant')}
                        className={`fixed inset-0 z-50 flex flex-col overflow-hidden border shadow-2xl md:absolute md:inset-auto md:bottom-full md:left-0 md:mb-3 md:[border-radius:var(--pebble-c)] ${panelSize}`}
                        style={{
                            background: 'var(--bg)',
                            borderColor: 'var(--border)',
                            color: 'var(--text)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                            paddingTop: isDesktop ? undefined : 'env(safe-area-inset-top)',
                            height: !isDesktop && mobileHeight ? `${mobileHeight}px` : undefined,
                        }}
                    >
                        {/* header */}
                        <div
                            className="flex shrink-0 items-center justify-between gap-2 px-4 py-3"
                            style={{ borderBottom: '1px solid var(--border)' }}
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <span
                                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                                    style={{ background: 'var(--accent)', color: '#fff' }}
                                >
                                    <BotMessageSquare size={15} aria-hidden="true" />
                                </span>
                                <span className="flex min-w-0 flex-col">
                                    <span className="truncate text-sm font-semibold" style={{ color: 'var(--text)' }}>
                                        {t('aiWidget.assistant')}
                                    </span>
                                    <span className="truncate text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                        {t('aiWidget.teaser')}
                                    </span>
                                </span>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                                <button
                                    type="button"
                                    onClick={newChat}
                                    disabled={isEmpty && !loading}
                                    aria-label={t('aiWidget.newChat')}
                                    title={t('aiWidget.newChat')}
                                    className="rounded-full p-2 transition-colors hover:bg-[var(--surface-card)] disabled:opacity-40"
                                >
                                    <RotateCcw size={15} aria-hidden="true" style={{ color: 'var(--text-muted)' }} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setExpanded((v) => !v)}
                                    aria-label={expanded ? t('aiWidget.collapse') : t('aiWidget.expand')}
                                    title={expanded ? t('aiWidget.collapse') : t('aiWidget.expand')}
                                    className="hidden rounded-full p-2 transition-colors hover:bg-[var(--surface-card)] md:inline-flex"
                                >
                                    {expanded ? (
                                        <Minimize2 size={15} aria-hidden="true" style={{ color: 'var(--text-muted)' }} />
                                    ) : (
                                        <Maximize2 size={15} aria-hidden="true" style={{ color: 'var(--text-muted)' }} />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    aria-label={t('aiWidget.close')}
                                    title={t('aiWidget.close')}
                                    className="rounded-full p-2 transition-colors hover:bg-[var(--surface-card)]"
                                >
                                    <X size={17} aria-hidden="true" style={{ color: 'var(--text-muted)' }} />
                                </button>
                            </div>
                        </div>

                        {/* messages */}
                        <div className="relative flex-1 overflow-hidden">
                            <div
                                ref={scrollRef}
                                onScroll={handleScroll}
                                className="flex h-full flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-4"
                                aria-live="polite"
                                aria-atomic="false"
                            >
                                {/* welcome — reactive to language changes */}
                                <div className="flex justify-start">
                                    <div
                                        className="max-w-[85%] [border-radius:18px_18px_18px_6px] px-3.5 py-2.5 text-sm leading-relaxed"
                                        style={{ background: 'var(--surface-card)', color: 'var(--text)', border: '1px solid var(--border)' }}
                                    >
                                        {t('aiWidget.welcome')}
                                    </div>
                                </div>

                                {isEmpty && !loading && (
                                    <div className="mt-1 flex flex-col gap-2">
                                        <span
                                            className="text-[11px]"
                                            style={{ color: 'var(--text-subtle)' }}
                                        >
                                            {t('aiWidget.suggestionsTitle')}
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {SUGGESTION_KEYS.map((key) => {
                                                const question = t(`aiWidget.suggestions.${key}`)
                                                return (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        onClick={() => ask(question)}
                                                        className="rounded-full border px-3 py-1.5 text-left text-[13px] leading-snug transition-colors hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)]"
                                                        style={{
                                                            background: 'var(--surface-card)',
                                                            borderColor: 'var(--border)',
                                                            color: 'var(--text)',
                                                        }}
                                                    >
                                                        {question}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`group flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] whitespace-pre-wrap break-words px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? '[border-radius:18px_18px_6px_18px]' : '[border-radius:18px_18px_18px_6px]'}`}
                                            style={
                                                msg.role === 'user'
                                                    ? { background: 'var(--accent)', color: '#fff' }
                                                    : { background: 'var(--surface-card)', color: 'var(--text)', border: '1px solid var(--border)' }
                                            }
                                        >
                                            {msg.content}
                                        </div>
                                        {msg.role === 'assistant' && msg.actions && msg.actions.length > 0 && (
                                            <div className="flex max-w-[85%] flex-wrap gap-2 pt-0.5">
                                                {msg.actions.map((id) => (
                                                    <Link
                                                        key={id}
                                                        to={actionHref(id)}
                                                        onClick={(e) => runAction(e, id)}
                                                        className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)]"
                                                        style={{
                                                            background: 'var(--surface-card)',
                                                            borderColor: 'var(--border)',
                                                            color: 'var(--text)',
                                                        }}
                                                    >
                                                        {t(AI_ACTIONS[id].labelKey)}
                                                        <ArrowUpRight size={13} aria-hidden="true" />
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                        {msg.role === 'assistant' && (
                                            <button
                                                type="button"
                                                onClick={() => void copyMessage(msg.content, i)}
                                                aria-label={t('aiWidget.copy')}
                                                title={copiedIndex === i ? t('aiWidget.copied') : t('aiWidget.copy')}
                                                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
                                                style={{ color: 'var(--text-subtle)' }}
                                            >
                                                {copiedIndex === i ? (
                                                    <>
                                                        <Check size={12} aria-hidden="true" />
                                                        {t('aiWidget.copied')}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={12} aria-hidden="true" />
                                                        {t('aiWidget.copy')}
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {loading && (
                                    <div className="flex justify-start">
                                        <div
                                            className="flex items-center gap-1.5 [border-radius:18px_18px_18px_6px] px-3.5 py-3"
                                            style={{ background: 'var(--surface-card)', border: '1px solid var(--border)' }}
                                        >
                                            <span className="sr-only">{t('aiWidget.thinking')}</span>
                                            {[0, 1, 2].map((d) => (
                                                <span
                                                    key={d}
                                                    aria-hidden="true"
                                                    className="ai-typing-dot inline-block h-1.5 w-1.5 rounded-full"
                                                    style={{ background: 'var(--text-muted)', animationDelay: `${d * 0.16}s` }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {failed && (
                                    <div className="flex flex-col items-start gap-2">
                                        <div
                                            className="max-w-[85%] [border-radius:18px_18px_18px_6px] px-3.5 py-2.5 text-sm leading-relaxed"
                                            style={{
                                                background: 'var(--accent-bg)',
                                                border: '1px solid var(--accent-border)',
                                                color: 'var(--text)',
                                            }}
                                            role="alert"
                                        >
                                            {t('aiWidget.error')}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={retry}
                                            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)]"
                                            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                                        >
                                            <RotateCcw size={13} aria-hidden="true" />
                                            {t('aiWidget.retry')}
                                        </button>
                                    </div>
                                )}

                                <div ref={bottomRef} />
                            </div>

                            {!atBottom && (
                                <button
                                    type="button"
                                    onClick={() => scrollToBottom()}
                                    aria-label={t('aiWidget.scrollToBottom')}
                                    title={t('aiWidget.scrollToBottom')}
                                    className="absolute bottom-3 left-1/2 inline-flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border p-0 shadow-lg transition-transform hover:-translate-y-0.5"
                                    style={{
                                        background: 'var(--surface)',
                                        borderColor: 'var(--border)',
                                        color: 'var(--text)',
                                        backdropFilter: 'blur(12px)',
                                        WebkitBackdropFilter: 'blur(12px)',
                                    }}
                                >
                                    <ArrowDown size={15} aria-hidden="true" />
                                </button>
                            )}
                        </div>

                        {/* input */}
                        <div
                            className="shrink-0 px-3 pt-3"
                            style={{
                                borderTop: '1px solid var(--border)',
                                paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
                            }}
                        >
                            <div
                                className="ai-input-shell pebble-sm flex items-end gap-2 border px-3 py-2 transition-colors focus-within:border-[var(--accent-border)]"
                                style={{ background: 'var(--surface-card)', borderColor: 'var(--border)' }}
                            >
                                <textarea
                                    ref={inputRef}
                                    rows={1}
                                    value={input}
                                    onChange={(e) => {
                                        setInput(e.target.value)
                                        resizeTextarea(e.target)
                                    }}
                                    onKeyDown={handleKey}
                                    maxLength={MAX_INPUT_CHARS}
                                    placeholder={t('aiWidget.placeholder')}
                                    aria-label={t('aiWidget.inputLabel')}
                                    className="max-h-[120px] flex-1 resize-none bg-transparent py-1 text-sm leading-relaxed outline-none focus-visible:outline-none"
                                    style={{ color: 'var(--text)' }}
                                />
                                {loading ? (
                                    <button
                                        type="button"
                                        onClick={stop}
                                        aria-label={t('aiWidget.stop')}
                                        title={t('aiWidget.stop')}
                                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border p-0 transition-colors hover:bg-[var(--accent-bg)]"
                                        style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                                    >
                                        <Square size={13} aria-hidden="true" fill="currentColor" />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => ask(input)}
                                        disabled={!canSend}
                                        aria-label={t('aiWidget.send')}
                                        title={t('aiWidget.send')}
                                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full p-0 transition-transform hover:scale-105 disabled:scale-100 disabled:opacity-40"
                                        style={{ background: 'var(--accent)', color: '#fff' }}
                                    >
                                        <Send size={15} aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center justify-between gap-2 px-1 pt-1.5">
                                <span className="text-[10px]" style={{ color: 'var(--text-subtle)' }}>
                                    {t('aiWidget.disclaimer')}
                                </span>
                                {showCounter && (
                                    <span className="shrink-0 text-[10px] tabular-nums" style={{ color: 'var(--text-subtle)' }}>
                                        {input.length}/{MAX_INPUT_CHARS}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* toggle button */}
                <button
                    type="button"
                    onClick={() => setIsOpen((v) => !v)}
                    aria-label={isOpen ? t('aiWidget.closed') : t('aiWidget.open')}
                    aria-expanded={isOpen}
                    className={`ai-launcher pebble-sm group inline-flex items-center border p-2 text-left transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0.28,1)] hover:-translate-y-0.5 ${isOpen ? 'hidden md:inline-flex' : ''}`}
                    style={{
                        background: 'var(--surface)',
                        borderColor: 'var(--border)',
                        color: 'var(--text)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        boxShadow: 'var(--shadow-lifted)',
                    }}
                >
                    <span
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                        style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
                    >
                        <BotMessageSquare size={18} aria-hidden="true" />
                    </span>

                    <span className="ai-launcher-label hidden md:grid" aria-hidden="true">
                        <span className="flex flex-col pr-2">
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                {t('aiWidget.assistant')}
                            </span>
                            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                                {t('aiWidget.teaser')}
                            </span>
                        </span>
                    </span>
                </button>
            </div>
        </>
    )
}
