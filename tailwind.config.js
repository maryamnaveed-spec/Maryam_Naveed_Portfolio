/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        pink: {
          50: 'rgb(var(--pink-50) / <alpha-value>)',
          100: 'rgb(var(--pink-100) / <alpha-value>)',
          400: 'rgb(var(--pink-400) / <alpha-value>)',
          600: 'rgb(var(--pink-600) / <alpha-value>)'
        },
        ink: 'rgb(var(--ink) / <alpha-value>)',
        inksoft: 'rgb(var(--inksoft) / <alpha-value>)',
        gold: 'rgb(var(--gold) / <alpha-value>)',
        goldlight: 'rgb(var(--goldlight) / <alpha-value>)',
        borderpink: 'rgb(var(--borderpink) / <alpha-value>)'
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', '"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        hand: ['"Caveat"', 'cursive']
      },
      backdropBlur: {
        xs: '2px'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeUp: 'fadeUp 0.7s ease-out forwards'
      }
    }
  },
  plugins: []
};
