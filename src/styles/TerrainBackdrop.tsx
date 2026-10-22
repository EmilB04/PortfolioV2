import { useLocation } from 'react-router-dom'

/**
 * The page sits on a survey map rather than a flat colour. Two summits are
 * drawn as nested contour lines, a warm light falls from the top of the view
 * and a grain layer sits over everything so the surfaces read as paper instead
 * of glass. Everything is fixed, static and decorative — it never scrolls,
 * never animates and never takes pointer events.
 *
 * Only the front page gets the full map. Every other route is for reading, so
 * there the backdrop drops to the plain ground colour with a faint light at the
 * top and the grain, and nothing competes with the text.
 */

type Summit = {
    cx: number
    cy: number
    /** Radius of the innermost ring, in viewBox units. */
    r0: number
    /** Distance between two rings. */
    step: number
    rings: number
    /** Harmonic amplitudes and phases that give the summit its shape. */
    shape: { k: number; a: number; p: number }[]
}

const SUMMITS: Summit[] = [
    {
        cx: 1180,
        cy: 230,
        r0: 26,
        step: 34,
        rings: 15,
        shape: [
            { k: 2, a: 0.16, p: 0.4 },
            { k: 3, a: 0.07, p: 1.9 },
            { k: 5, a: 0.025, p: 0.8 },
        ],
    },
    {
        cx: 170,
        cy: 860,
        r0: 22,
        step: 30,
        rings: 11,
        shape: [
            { k: 2, a: 0.12, p: 2.6 },
            { k: 3, a: 0.09, p: 0.3 },
            { k: 4, a: 0.03, p: 1.2 },
        ],
    },
]

const POINTS = 96

/** One closed ring around a summit. The outer rings take on a little more of
 *  the summit's shape, so the slope reads as terrain instead of a target, but
 *  the shape never grows fast enough for two rings to cross. */
function ringPath(summit: Summit, index: number) {
    const r = summit.r0 + summit.step * index
    const grow = 1 + index * 0.06
    let d = ''
    for (let i = 0; i < POINTS; i += 1) {
        const t = (i / POINTS) * Math.PI * 2
        const wobble = summit.shape.reduce((sum, h) => sum + h.a * grow * Math.sin(h.k * t + h.p), 0)
        const x = summit.cx + Math.cos(t) * r * (1 + wobble)
        const y = summit.cy + Math.sin(t) * r * (1 + wobble) * 0.82
        d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    }
    return `${d}Z`
}

/** Computed once at module load: the map is identical on the server and in
 *  the browser, so hydration never sees a difference. */
const CONTOURS = SUMMITS.flatMap((summit, s) =>
    Array.from({ length: summit.rings }, (_, i) => ({
        key: `${s}-${i}`,
        d: ringPath(summit, i),
        // Every fifth line is an index contour, drawn heavier as on a real map.
        index: i % 5 === 4,
    })),
)

export default function TerrainBackdrop() {
    const { pathname } = useLocation()
    const variant = pathname === '/' ? 'map' : 'plain'

    return (
        <div className="terrain-backdrop" data-variant={variant} aria-hidden="true">
            {/* Light from the top of the view, stronger on the front page. */}
            <div className="terrain-light absolute inset-0" />

            {variant === 'map' && (
                <svg
                    className="terrain-map absolute inset-0 h-full w-full"
                    viewBox="0 0 1440 1000"
                    preserveAspectRatio="xMidYMid slice"
                    focusable="false"
                >
                    {CONTOURS.map((line) => (
                        <path
                            key={line.key}
                            d={line.d}
                            fill="none"
                            stroke={line.index ? 'var(--topo-line-index)' : 'var(--topo-line)'}
                            strokeWidth={line.index ? 1.4 : 1}
                            vectorEffect="non-scaling-stroke"
                        />
                    ))}
                </svg>
            )}

            <div className="grain-overlay" />
        </div>
    )
}
