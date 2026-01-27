/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#7C3AED',
                secondary: '#A78BFA',
                cta: '#F97316',
                background: '#FAF5FF',
                text: '#4C1D95',
                'soft-pink': '#FFD6E0', // Kept as requested in Master file notes
            },
            fontFamily: {
                heading: ['"Great Vibes"', 'cursive'],
                body: ['"Cormorant Infant"', 'serif'],
                classic: ['"Gowun Batang"', 'serif'],
                pixel: ['"DungGeunMo"', '"Silkscreen"', 'cursive'],
            },
            boxShadow: {
                'soft-sm': 'var(--shadow-sm)',
                'soft-md': 'var(--shadow-md)',
                'soft-lg': 'var(--shadow-lg)',
                'soft-xl': 'var(--shadow-xl)',
            },
            spacing: {
                'xs': 'var(--space-xs)',
                'sm': 'var(--space-sm)',
                'md': 'var(--space-md)',
                'lg': 'var(--space-lg)',
                'xl': 'var(--space-xl)',
                '2xl': 'var(--space-2xl)',
                '3xl': 'var(--space-3xl)',
            },
            keyframes: {
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            },
            animation: {
                'fade-in-up': 'fade-in-up 0.5s ease-out',
            }
        },
    },
    plugins: [],
}
