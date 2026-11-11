/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#064e3b',
          950: '#022c22',
        },
        earth: {
          50: '#fbfaf8',
          100: '#f5f2eb',
          200: '#ebe3d4',
          300: '#dacdb5',
          400: '#c5b091',
          500: '#b19572',
          600: '#9d7e5e',
          700: '#81654d',
          800: '#6b5442',
          900: '#584537',
        },
        harvest: {
          amber: '#d97706',
          gold: '#f59e0b',
          light: '#fef3c7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Malayalam', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
