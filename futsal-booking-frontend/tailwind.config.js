/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eefff3',
          100: '#d7ffe6',
          200: '#b2ffce',
          300: '#75ffaa',
          400: '#32f57d',
          500: '#09de58',
          600: '#00b844',
          700: '#009038',
          800: '#04712f',
          900: '#065c28',
          950: '#003414',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
