import { useEffect, useRef, type CSSProperties } from 'react'

/**
 * The page sits in a landscape rather than on a flat colour. Three ridge
 * silhouettes stack at the bottom of the viewport, haze drifts behind them,
 * motes float through the air and a grain layer sits over everything so the
 * surfaces read as paper instead of glass. Everything is fixed and decorative —
 * it never scrolls and never takes pointer events.
 *
 * The scene is driven by two clocks. `--sp` holds the eased page progress
 * (0 → 1): the ridges climb and pull apart, the range grows, the haze crosses
 * the view and the light warms as the reader moves down. On top of that every
 * layer keeps its own idle animation, so the landscape is never still even when
 * the page is.
 */

/** Floating motes. Fixed values keep the drift identical between renders. */
const MOTES = [
    { left: '8%', top: '18%', size: 5, mx: '5vw', my: '-58vh', dur: '13s', delay: '-2s', opacity: 0.5 },
    { left: '17%', top: '62%', size: 3, mx: '-4vw', my: '-96vh', dur: '9s', delay: '-5s', opacity: 0.35 },
    { left: '26%', top: '34%', size: 7, mx: '7vw', my: '-42vh', dur: '17s', delay: '-1s', opacity: 0.4 },
    { left: '34%', top: '78%', size: 4, mx: '3vw', my: '-124vh', dur: '11s', delay: '-7s', opacity: 0.45 },
    { left: '43%', top: '12%', size: 3, mx: '-6vw', my: '-66vh', dur: '15s', delay: '-3s', opacity: 0.3 },
    { left: '52%', top: '48%', size: 6, mx: '4vw', my: '-88vh', dur: '12s', delay: '-9s', opacity: 0.5 },
    { left: '61%', top: '26%', size: 4, mx: '-5vw', my: '-52vh', dur: '18s', delay: '-4s', opacity: 0.35 },
    { left: '68%', top: '70%', size: 5, mx: '6vw', my: '-110vh', dur: '10s', delay: '-6s', opacity: 0.45 },
    { left: '77%', top: '40%', size: 3, mx: '-3vw', my: '-74vh', dur: '14s', delay: '-8s', opacity: 0.3 },
    { left: '84%', top: '16%', size: 6, mx: '5vw', my: '-46vh', dur: '16s', delay: '-2.5s', opacity: 0.4 },
    { left: '91%', top: '58%', size: 4, mx: '-7vw', my: '-102vh', dur: '11.5s', delay: '-10s', opacity: 0.45 },
    { left: '96%', top: '32%', size: 3, mx: '4vw', my: '-64vh', dur: '13.5s', delay: '-1.5s', opacity: 0.3 },
]

export default function TerrainBackdrop() {
    const rootRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const root = rootRef.current
        if (!root) return

        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        let frame = 0
        let target = 0
        let current = 0

        const readProgress = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight
            target = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0
        }

        // The value trails the scroll position so a flick of the wheel still
        // moves the landscape smoothly instead of snapping. It only ever eases
        // towards the real progress, so the ridges never jerk backwards.
        const step = () => {
            current += (target - current) * 0.09
            if (Math.abs(target - current) < 0.0004) current = target
            root.style.setProperty('--sp', current.toFixed(4))
            frame = current === target ? 0 : requestAnimationFrame(step)
        }

        const onScroll = () => {
            readProgress()
            if (motionQuery.matches) {
                current = target
                root.style.setProperty('--sp', current.toFixed(4))
                return
            }
            if (!frame) frame = requestAnimationFrame(step)
        }

        readProgress()
        current = target
        root.style.setProperty('--sp', current.toFixed(4))

        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)
        return () => {
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
            if (frame) cancelAnimationFrame(frame)
        }
    }, [])

    return (
        <div className="terrain-backdrop" aria-hidden="true" ref={rootRef}>
            <style>{`
                .terrain-backdrop { --sp: 0; }

                /* ── Idle clocks ─────────────────────────────── */
                @keyframes hazeDrift {
                    from { transform: translate3d(-9%, 4%, 0) scale(1); }
                    to   { transform: translate3d(14%, -7%, 0) scale(1.3); }
                }
                @keyframes hazeDriftB {
                    from { transform: translate3d(8%, -5%, 0) scale(1.18); }
                    to   { transform: translate3d(-12%, 6%, 0) scale(0.92); }
                }
                /* The ridges roll sideways and breathe, so the horizon keeps
                   moving while the page is parked. */
                @keyframes ridgeSway {
                    from { transform: translate(calc(var(--sway-x) * -1), 0) scaleY(1); }
                    50%  { transform: translate(0, var(--sway-y)) scaleY(1.035); }
                    to   { transform: translate(var(--sway-x), 0) scaleY(1); }
                }
                @keyframes moteFloat {
                    from { transform: translate3d(-14px, 10px, 0) scale(0.7); opacity: 0.15; }
                    50%  { transform: translate3d(8px, -12px, 0) scale(1.15); opacity: 1; }
                    to   { transform: translate3d(18px, -26px, 0) scale(0.8); opacity: 0.25; }
                }

                /* ── Scroll-driven layers ────────────────────── */
                .terrain-sky {
                    transform: translate3d(0, calc(var(--sp) * -18vh), 0) scale(calc(1 + var(--sp) * 0.25));
                    opacity: calc(0.35 + var(--sp) * 0.65);
                    will-change: transform;
                }

                .terrain-haze-shell {
                    transform: translate3d(calc(var(--sp) * 46vw), calc(var(--sp) * -78vh), 0)
                               scale(calc(1 + var(--sp) * 0.9));
                    opacity: calc(0.6 + var(--sp) * 0.7);
                    will-change: transform;
                }
                .terrain-haze-shell--b {
                    transform: translate3d(calc(var(--sp) * -38vw), calc(var(--sp) * -52vh), 0)
                               scale(calc(1.1 - var(--sp) * 0.35));
                    opacity: calc(0.9 - var(--sp) * 0.45);
                }
                .terrain-haze  { animation: hazeDrift 21s ease-in-out infinite alternate; }
                .terrain-haze--b { animation: hazeDriftB 29s ease-in-out infinite alternate; }

                /* Each ridge climbs at its own rate and the whole range grows,
                   so the bands pull far apart on the way down the page. */
                .terrain-range {
                    height: calc(46vh + var(--sp) * 34vh);
                    will-change: height;
                }
                .terrain-ridge {
                    transform: translate(calc(var(--drift) * var(--sp) * 1px), calc(var(--rise) * var(--sp) * -1px));
                    will-change: transform;
                }
                .terrain-sway {
                    animation: ridgeSway var(--sway-dur) ease-in-out infinite alternate;
                    animation-delay: var(--sway-delay, 0s);
                    transform-origin: 720px 620px;
                    will-change: transform;
                }

                .terrain-contours {
                    background-position: calc(var(--sp) * 620px) calc(var(--sp) * -900px);
                    transform: rotate(calc(var(--sp) * 4deg)) scale(calc(1 + var(--sp) * 0.15));
                    opacity: calc(1 - var(--sp) * 0.45);
                    will-change: transform, background-position;
                }

                .terrain-mote {
                    position: absolute;
                    transform: translate3d(calc(var(--sp) * var(--mx)), calc(var(--sp) * var(--my)), 0);
                    will-change: transform;
                }
                .terrain-mote-dot {
                    display: block;
                    border-radius: 9999px;
                    background: color-mix(in srgb, var(--accent) 65%, var(--text));
                    filter: blur(0.5px);
                    animation: moteFloat var(--dur) ease-in-out infinite alternate;
                    animation-delay: var(--delay);
                }

                /* Accent light that only arrives further down the page. */
                .terrain-tint {
                    opacity: var(--sp);
                    background:
                        radial-gradient(80% 50% at 50% 100%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 72%),
                        linear-gradient(to bottom, color-mix(in srgb, var(--accent) 12%, transparent), transparent 52%);
                }

                @media (prefers-reduced-motion: reduce) {
                    .terrain-haze,
                    .terrain-haze--b,
                    .terrain-sway,
                    .terrain-mote-dot { animation: none; }
                    .terrain-sky,
                    .terrain-haze-shell,
                    .terrain-haze-shell--b,
                    .terrain-ridge,
                    .terrain-contours,
                    .terrain-mote { transform: none; }
                    .terrain-range { height: 46vh; }
                    .terrain-contours { background-position: 0 0; }
                }
            `}</style>

            {/* Sky wash that lifts and opens as the page moves. */}
            <div
                className="terrain-sky absolute inset-0"
                style={{
                    background:
                        'radial-gradient(90% 60% at 30% 12%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 70%)',
                }}
            />

            {/* Accent wash layered over the base gradient as the page scrolls. */}
            <div className="terrain-tint absolute inset-0" />

            {/* Two light sources crossing the view in opposite directions. */}
            <div className="terrain-haze-shell absolute left-[6%] top-[46%] h-[46vh] w-[54vh]">
                <div
                    className="terrain-haze h-full w-full rounded-full blur-[130px]"
                    style={{ background: 'var(--haze)' }}
                />
            </div>
            <div className="terrain-haze-shell terrain-haze-shell--b absolute right-[4%] top-[62%] h-[40vh] w-[48vh]">
                <div
                    className="terrain-haze terrain-haze--b h-full w-full rounded-full blur-[150px]"
                    style={{ background: 'var(--haze)' }}
                />
            </div>

            {/* Dust lifted off the ridges, carried up the view while scrolling. */}
            {MOTES.map((mote, index) => (
                <div
                    key={index}
                    className="terrain-mote"
                    style={
                        {
                            left: mote.left,
                            top: mote.top,
                            '--mx': mote.mx,
                            '--my': mote.my,
                        } as CSSProperties
                    }
                >
                    <span
                        className="terrain-mote-dot"
                        style={
                            {
                                width: mote.size,
                                height: mote.size,
                                opacity: mote.opacity,
                                '--dur': mote.dur,
                                '--delay': mote.delay,
                            } as CSSProperties
                        }
                    />
                </div>
            ))}

            {/* Topographic hatching, strongest near the horizon. */}
            <div
                className="contours terrain-contours absolute inset-x-[-10%] bottom-0 h-[72vh]"
                style={{
                    maskImage: 'linear-gradient(to top, black, transparent 78%)',
                    WebkitMaskImage: 'linear-gradient(to top, black, transparent 78%)',
                }}
            />

            <svg
                className="terrain-range absolute bottom-0 left-[-12%] w-[124%]"
                viewBox="0 0 1440 420"
                preserveAspectRatio="none"
                focusable="false"
            >
                {/* Far ridge — the softest, highest line. Every path runs far
                    below the viewBox so a risen ridge never leaves a gap. */}
                <g className="terrain-ridge" style={{ '--rise': 180, '--drift': 120 } as CSSProperties}>
                    <g
                        className="terrain-sway"
                        style={{ '--sway-dur': '19s', '--sway-x': '34px', '--sway-y': '12px' } as CSSProperties}
                    >
                        <path
                            d="M0 232 C 118 196 196 246 284 232 C 392 214 452 150 566 162 C 690 175 742 244 858 240 C 968 236 1040 178 1148 186 C 1258 194 1326 238 1440 220 L1440 1400 L0 1400 Z"
                            fill="var(--terrain-far)"
                        />
                    </g>
                </g>
                {/* Mid ridge. */}
                <g className="terrain-ridge" style={{ '--rise': 300, '--drift': -86 } as CSSProperties}>
                    <g
                        className="terrain-sway"
                        style={{
                            '--sway-dur': '14s',
                            '--sway-x': '26px',
                            '--sway-y': '9px',
                            '--sway-delay': '-4s',
                        } as CSSProperties}
                    >
                        <path
                            d="M0 300 C 132 268 214 312 330 302 C 452 291 520 244 638 258 C 760 272 812 322 930 316 C 1046 310 1120 268 1230 278 C 1330 287 1380 314 1440 302 L1440 1400 L0 1400 Z"
                            fill="var(--terrain-mid)"
                        />
                    </g>
                </g>
                {/* Near ridge — darkest, anchors the footer. */}
                <g className="terrain-ridge" style={{ '--rise': 400, '--drift': 58 } as CSSProperties}>
                    <g
                        className="terrain-sway"
                        style={{
                            '--sway-dur': '10s',
                            '--sway-x': '18px',
                            '--sway-y': '7px',
                            '--sway-delay': '-2s',
                        } as CSSProperties}
                    >
                        <path
                            d="M0 366 C 150 344 240 376 372 370 C 500 364 566 334 700 342 C 836 350 892 384 1020 380 C 1140 376 1230 348 1330 356 C 1392 361 1420 370 1440 366 L1440 1400 L0 1400 Z"
                            fill="var(--terrain-near)"
                        />
                    </g>
                </g>
            </svg>

            <div className="grain-overlay" />
        </div>
    )
}
