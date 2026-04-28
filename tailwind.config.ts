import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          900: '#0f0e0d',
          800: '#1a1917',
          700: '#252320',
          600: '#302e2b',
        },
        sepia: {
          100: '#f5f0e8',
          200: '#e8dfc8',
          300: '#c9b99a',
          400: '#a8936e',
        },
        gold: {
          300: '#e2c46a',
          400: '#c9a84c',
          500: '#b8931e',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
        mono: ['"Roboto Mono"', 'monospace'],
      },
      keyframes: {
        'slide-out-left': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-3%)', opacity: '0' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(3%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(3%)', opacity: '0' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-3%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'score-reveal': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'slide-out-left': 'slide-out-left 0.25s ease-in forwards',
        'slide-in-right': 'slide-in-right 0.25s ease-out forwards',
        'slide-out-right': 'slide-out-right 0.25s ease-in forwards',
        'slide-in-left': 'slide-in-left 0.25s ease-out forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'score-reveal': 'score-reveal 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
    },
  },
  plugins: [],
} satisfies Config
