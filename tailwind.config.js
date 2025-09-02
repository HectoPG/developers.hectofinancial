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
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}