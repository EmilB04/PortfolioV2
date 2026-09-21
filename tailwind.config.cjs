module.exports = {
    darkMode: 'class',
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        screens: {
            md: '1024px'
        },
        extend: {
            maxWidth: {
                'screen-xl': '1200px',
            },
            colors: {
                ink: 'var(--text)',
                muted: 'var(--text-muted)',
                subtle: 'var(--text-subtle)',
                accent: 'var(--accent)',
                'accent-text': 'var(--accent-text)',
                surface: 'var(--surface)',
                card: 'var(--surface-card)',
                raised: 'var(--surface-raised)',
                hairline: 'var(--border)',
            },
            fontFamily: {
                sans: ['Bricolage Grotesque', 'Trebuchet MS', 'system-ui', 'sans-serif'],
                serif: ['Newsreader', 'Georgia', 'serif'],
            },
            borderRadius: {
                pebble: '44px 16px 38px 22px / 28px 42px 18px 34px',
                'pebble-b': '16px 46px 18px 40px / 42px 20px 44px 22px',
                'pebble-c': '34px 24px 48px 14px / 18px 40px 24px 46px',
                'pebble-sm': '18px 7px 16px 9px / 9px 18px 7px 16px',
            },
            keyframes: {
                drift: {
                    '0%': { transform: 'translate3d(0, 0, 0)' },
                    '100%': { transform: 'translate3d(-18px, -22px, 0)' },
                },
            },
            animation: {
                drift: 'drift 14s ease-in-out infinite alternate',
            },
        }
    },
    plugins: [
        require('@tailwindcss/typography')
    ]
}
