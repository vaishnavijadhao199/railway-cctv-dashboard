/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          100: '#161b26',
          200: '#12161f',
          300: '#0d1117',
        },
        accent: {
          cyan: '#00f5ff',
          green: '#00ff88',
          red: '#ff3366',
          orange: '#ff8800',
        }
      }
    },
  },
  plugins: [],
}