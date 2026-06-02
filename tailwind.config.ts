import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nm: {
          blue:  '#0B3A75',
          dark:  '#082D5A',
          light: '#1A4E8F',
          gray:  '#F5F7FA',
          line:  '#E2E6EB',
          text:  '#1A1A1A',
          muted: '#5C6370',
          red:   '#CC0000',
          gold:  '#F0B823',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2.8rem, 6vw, 5.5rem)', { lineHeight: '1.04', letterSpacing: '-0.025em', fontWeight: '900' }],
        'headline': ['clamp(2rem, 3.5vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'subhead':  ['clamp(1.25rem, 2vw, 1.5rem)', { lineHeight: '1.35', fontWeight: '600' }],
      },
      maxWidth: {
        'content': '1200px',
        'prose-xl': '760px',
      },
      boxShadow: {
        'nav': '0 1px 0 0 #E2E6EB',
      },
    },
  },
  plugins: [],
} satisfies Config
