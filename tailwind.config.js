/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans JP"', '"Noto Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif JP"', 'serif'],
      },
      colors: {
        washi: {
          50: '#fdfbf7',
          100: '#f7f2e9',
          200: '#ede4d3',
          300: '#e0d2b8',
          400: '#cdb38f',
          500: '#b8966a',
        },
        wood: {
          50: '#f9f6f1',
          100: '#f0e9dd',
          200: '#e0d0b8',
          300: '#c9b191',
          400: '#b09572',
          500: '#937a58',
        },
        matcha: {
          50: '#f1f6f0',
          100: '#dfeadd',
          200: '#c0d6bd',
          300: '#9bbf97',
          400: '#6fa069',
          500: '#4f8449',
          600: '#3d6b38',
          700: '#335a30',
        },
        sumi: {
          50: '#f6f6f5',
          100: '#e7e6e3',
          200: '#d0cec9',
          300: '#a8a59d',
          400: '#7d7a72',
          500: '#5c5a53',
          600: '#464440',
          700: '#323130',
          800: '#1f1e1c',
          900: '#131312',
        },
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(60, 56, 50, 0.08)',
        'soft-lg': '0 8px 30px -6px rgba(60, 56, 50, 0.12)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '70%': { transform: 'scale(1.3)', opacity: '0' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out both',
        'scale-in': 'scale-in 0.3s ease-out both',
        'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
      },
    },
  },
  plugins: [],
};
