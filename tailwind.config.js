/** @type {import('tailwindcss').Config} */
module.exports = {
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
                'soft-pink': '#FFD6E0',
            },
            fontFamily: {
                heading: ['"Great Vibes"', 'cursive'],
                body: ['"Cormorant Infant"', 'serif'],
            },
            boxShadow: {
                'soft-sm': '0 1px 2px rgba(0,0,0,0.05)',
                'soft-md': '0 4px 6px rgba(0,0,0,0.1)',
                'soft-lg': '0 10px 15px rgba(0,0,0,0.1)',
                'soft-xl': '0 20px 25px rgba(0,0,0,0.15)',
            },
            spacing: {
                'xs': '4px',
                'sm': '8px',
                'md': '16px',
                'lg': '24px',
                'xl': '32px',
                '2xl': '48px',
                '3xl': '64px',
            }
        },
    },
    plugins: [],
}
