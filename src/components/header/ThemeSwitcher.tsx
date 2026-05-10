// ThemeSwitcher.tsx
import { motion, useAnimation } from 'motion/react'
import { useTheme } from '../../hooks/useTheme'

function MoonIcon({ active }: { active: boolean }) {
    return (
        <motion.svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            animate={{ color: active ? '#1e1b4b' : '#a5b4fc' }}
            transition={{ duration: 0.3 }}
        >
            <motion.path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                fill="currentColor"
            />
            <motion.circle
                cx="19"
                cy="4"
                r="1"
                fill="#f0abfc"
                animate={{ opacity: active ? 0 : 1, scale: active ? 0 : 1 }}
                transition={{ duration: 0.3 }}
            />
            <motion.circle
                cx="22"
                cy="7"
                r="0.75"
                fill="#f0abfc"
                animate={{ opacity: active ? 0 : 1, scale: active ? 0 : 1 }}
                transition={{ duration: 0.3, delay: 0.05 }}
            />
            <motion.circle
                cx="20.5"
                cy="2"
                r="0.5"
                fill="#e879f9"
                animate={{ opacity: active ? 0 : 1, scale: active ? 0 : 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            />
        </motion.svg>
    )
}

function SunIcon({ active }: { active: boolean }) {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <motion.line
                    key={angle}
                    x1={12 + 6 * Math.cos((angle * Math.PI) / 180)}
                    y1={12 + 6 * Math.sin((angle * Math.PI) / 180)}
                    x2={12 + 9.5 * Math.cos((angle * Math.PI) / 180)}
                    y2={12 + 9.5 * Math.sin((angle * Math.PI) / 180)}
                    stroke={active ? '#78350f' : '#fbbf24'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    animate={{
                        opacity: active ? 0 : 1,
                        x1: active
                            ? 12 + 4 * Math.cos((angle * Math.PI) / 180)
                            : 12 + 6 * Math.cos((angle * Math.PI) / 180),
                        y1: active
                            ? 12 + 4 * Math.sin((angle * Math.PI) / 180)
                            : 12 + 6 * Math.sin((angle * Math.PI) / 180),
                        x2: active
                            ? 12 + 5.5 * Math.cos((angle * Math.PI) / 180)
                            : 12 + 9.5 * Math.cos((angle * Math.PI) / 180),
                        y2: active
                            ? 12 + 5.5 * Math.sin((angle * Math.PI) / 180)
                            : 12 + 9.5 * Math.sin((angle * Math.PI) / 180),
                    }}
                    transition={{ duration: 0.3, delay: i * 0.02 }}
                />
            ))}
            <motion.circle
                cx="12"
                cy="12"
                r="4.5"
                fill="#fde68a"
                stroke={active ? '#78350f' : '#f59e0b'}
                strokeWidth="1.5"
                animate={{ r: active ? 3.8 : 4.5 }}
                transition={{ duration: 0.3 }}
            />
        </svg>
    )
}

export default function ThemeSwitcher() {
    const { isDark, toggleTheme } = useTheme()
    const controls = useAnimation()

    async function handleClick() {
        await controls.start({
            scale: [1, 0.88, 1.08, 1],
            transition: {
                duration: 0.35,
                times: [0, 0.3, 0.7, 1],
                ease: 'easeInOut',
            },
        })
        toggleTheme()
    }

    return (
        <motion.button
            onClick={handleClick}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="relative flex items-center gap-1 rounded-full p-1 cursor-pointer"
            animate={controls}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{
                background: isDark
                    ? 'linear-gradient(135deg, #1e1b4b, #312e81)'
                    : 'linear-gradient(135deg, #fef3c7, #fde68a)',
                border: '1px solid',
                borderColor: isDark ? '#4338ca' : '#f59e0b',
                transition: 'background 0.4s ease, border-color 0.4s ease',
            }}
        >
            {/* Sliding pill */}
            <motion.div
                className="absolute top-1 bottom-1 rounded-full"
                style={{
                    width: 'calc(50% - 4px)',
                    background: isDark
                        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                        : 'linear-gradient(135deg, #f59e0b, #fb923c)',
                }}
                animate={{ left: isDark ? '4px' : 'calc(50%)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />

            {/* Moon */}
            <motion.span
                className="relative z-10 flex items-center justify-center w-7 h-7"
                whileHover={{
                    rotate: [0, -15, 10, -5, 0],
                    transition: {
                        duration: 0.5,
                        ease: 'easeInOut',
                    },
                }}
            >
                <MoonIcon active={isDark} />
            </motion.span>

            {/* Sun */}
            <motion.span
                className="relative z-10 flex items-center justify-center w-7 h-7"
                whileHover={{
                    rotate: [0, 20, -10, 15, 0],
                    scale: [1, 1.2, 1.1, 1.15, 1],
                    transition: {
                        duration: 0.5,
                        ease: 'easeInOut',
                    },
                }}
            >
                <SunIcon active={!isDark} />
            </motion.span>
        </motion.button>
    )
}