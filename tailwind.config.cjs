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
        extend: {}
    },
    plugins: [
        require('@tailwindcss/typography')
    ]
}
