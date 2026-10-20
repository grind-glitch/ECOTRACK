/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Inter"', 'system-ui', 'sans-serif'] },
      colors: {
        // EcoTrack palette, matched to the mockups
        forest: { DEFAULT: '#123524', 900: '#0d2a1c', 800: '#123524', 700: '#1b4a33' },
        leaf: { DEFAULT: '#2f7d4f', 600: '#2f7d4f', 500: '#3d9a63', 400: '#7fbf95', 200: '#cfe6d6', 100: '#e8f3ec', 50: '#f3f8f4' },
        sun: { DEFAULT: '#f2b84b', 100: '#fdf3dc' },
        ink: { DEFAULT: '#14201a', 600: '#4a5a51', 400: '#8a978f' },
        line: '#e3e9e5',
        canvas: '#f4f6f4',
      },
      borderRadius: { xl: '14px', '2xl': '18px' },
    },
  },
  plugins: [],
}
