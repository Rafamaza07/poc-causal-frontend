/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd4ff',
          300: '#8ebbff',
          400: '#5996ff',
          500: '#3b76f6',
          600: '#2258db',
          700: '#1d47b8',
          800: '#1e3a8a',
          900: '#1a2f6b',
        },
        accent: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        sidebar: {
          DEFAULT: '#0f172a',
          light:   '#1e293b',
          accent:  '#334155',
        },
        severity: {
          critical: { light: '#fef2f2', DEFAULT: '#dc2626', dark: '#991b1b' },
          warning:  { light: '#fffbeb', DEFAULT: '#f59e0b', dark: '#92400e' },
          success:  { light: '#f0fdf4', DEFAULT: '#16a34a', dark: '#166534' },
          info:     { light: '#eff6ff', DEFAULT: '#2563eb', dark: '#1e40af' },
        },
      },
      boxShadow: {
        soft:          '0 2px 8px -2px rgba(0,0,0,0.08), 0 1px 3px -1px rgba(0,0,0,0.05)',
        card:          '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        lifted:        '0 4px 16px -4px rgba(0,0,0,0.1), 0 2px 6px -2px rgba(0,0,0,0.06)',
        elevated:      '0 8px 30px -6px rgba(0,0,0,0.14), 0 4px 10px -4px rgba(0,0,0,0.08)',
        glow:          '0 0 20px -5px rgba(59,130,246,0.3)',
        'glow-accent': '0 0 20px -5px rgba(139,92,246,0.35)',
      },
      animation: {
        'fade-in':     'fadeIn 0.3s ease-out',
        'slide-up':    'slideUp 0.35s ease-out',
        'slide-down':  'slideDown 0.25s ease-out',
        'scale-in':    'scaleIn 0.2s ease-out',
        'tooltip-in':  'tooltipIn 0.15s ease-out',
        'page-in':     'pageIn 0.18s ease-out',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                                          to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(8px)' },             to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-6px)' },            to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:   { from: { opacity: '0', transform: 'scale(0.95)' },                 to: { opacity: '1', transform: 'scale(1)' } },
        tooltipIn: { from: { opacity: '0', transform: 'scale(0.92) translateY(2px)' }, to: { opacity: '1', transform: 'scale(1) translateY(0)' } },
        pageIn:    { from: { opacity: '0', transform: 'translateY(5px)' },             to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
