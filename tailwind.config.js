/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hecto: {
          50: '#fff7f0',
          100: '#ffede0',
          200: '#ffd9c1',
          300: '#ffc199',
          400: '#ffb089', // 메인 브랜드 컬러
          500: '#ff9566',
          600: '#f07a42',
          700: '#e6652a',
          800: '#cc5722',
          900: '#b8491f',
        },
        primary: '#FFB089', // 메인 컬러 단축키
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'Proxima Nova', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'noto': ['Noto Sans KR', 'sans-serif'],
        'proxima': ['Proxima Nova', 'sans-serif'],
      },
      keyframes: {
        'scroll-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'scroll-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'rotate-y': {
          '0%': { transform: 'rotateY(0deg)' },
          '25%': { transform: 'rotateY(90deg)' },
          '50%': { transform: 'rotateY(180deg)' },
          '75%': { transform: 'rotateY(270deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
      },
      animation: {
        'scroll-left': 'scroll-left 30s linear infinite',
        'scroll-right': 'scroll-right 30s linear infinite',
        'scroll-left-slow': 'scroll-left 60s linear infinite',
        'rotate-y': 'rotate-y 4s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}