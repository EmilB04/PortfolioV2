/**
 * The page sits in a landscape rather than on a flat colour. Three ridge
 * silhouettes stack at the bottom of the viewport, a single slow haze drifts
 * behind them, and a grain layer sits over everything so the surfaces read as
 * paper instead of glass. Everything is fixed and decorative — it never scrolls
 * and never takes pointer events.
 */
export default function TerrainBackdrop() {
    return (
        <div className="terrain-backdrop" aria-hidden="true">
            <style>{`
                @keyframes hazeDrift {
                    from { transform: translate3d(-4%, 2%, 0) scale(1); }
                    to   { transform: translate3d(6%, -3%, 0) scale(1.12); }
                }
                .terrain-haze {
                    animation: hazeDrift 26s ease-in-out infinite alternate;
                }
                @media (prefers-reduced-motion: reduce) {
                    .terrain-haze { animation: none; }
                }
            `}</style>

            {/* One light source, low and off-centre, tinted by the chosen accent. */}
            <div
                className="terrain-haze absolute left-[6%] top-[24%] h-[38vh] w-[44vh] rounded-full blur-[130px]"
                style={{ background: 'var(--haze)' }}
            />

            {/* Topographic hatching, strongest near the horizon. */}
            <div
                className="contours absolute inset-x-0 bottom-0 h-[60vh]"
                style={{
                    maskImage: 'linear-gradient(to top, black, transparent 78%)',
                    WebkitMaskImage: 'linear-gradient(to top, black, transparent 78%)',
                }}
            />

            <svg
                className="absolute inset-x-0 bottom-0 h-[46vh] w-full"
                viewBox="0 0 1440 420"
                preserveAspectRatio="none"
                focusable="false"
            >
                {/* Far ridge — the softest, highest line. */}
                <path
                    d="M0 232 C 118 196 196 246 284 232 C 392 214 452 150 566 162 C 690 175 742 244 858 240 C 968 236 1040 178 1148 186 C 1258 194 1326 238 1440 220 L1440 420 L0 420 Z"
                    fill="var(--terrain-far)"
                />
                {/* Mid ridge. */}
                <path
                    d="M0 300 C 132 268 214 312 330 302 C 452 291 520 244 638 258 C 760 272 812 322 930 316 C 1046 310 1120 268 1230 278 C 1330 287 1380 314 1440 302 L1440 420 L0 420 Z"
                    fill="var(--terrain-mid)"
                />
                {/* Near ridge — darkest, anchors the footer. */}
                <path
                    d="M0 366 C 150 344 240 376 372 370 C 500 364 566 334 700 342 C 836 350 892 384 1020 380 C 1140 376 1230 348 1330 356 C 1392 361 1420 370 1440 366 L1440 420 L0 420 Z"
                    fill="var(--terrain-near)"
                />
            </svg>

            <div className="grain-overlay" />
        </div>
    )
}
