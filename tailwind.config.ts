import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nm: {
          blue: '#0B3A75',
          'blue-dark': '#082D5A',
          'blue-light': '#1A4E8F',
          sky: '#4F8DFF',
          'sky-light': '#7AAEFF',
          gold: '#F5B400',
          red: '#CC0000',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'progress': 'progress 1.2s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(32px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        progress: {
          from: { width: '0%' },
          to: { width: 'var(--progress-width)' },
        },
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, #082D5A 0%, #0B3A75 50%, #0D4A95 100%)',
        'card-gradient':
          'linear-gradient(135deg, rgba(79,141,255,0.1) 0%, rgba(11,58,117,0.05) 100%)',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(11,58,117,0.08)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10), 0 12px 40px rgba(11,58,117,0.15)',
        'glow-sky': '0 0 40px rgba(79,141,255,0.3)',
      },
    },
  },
  plugins: [],
} satisfies Config
