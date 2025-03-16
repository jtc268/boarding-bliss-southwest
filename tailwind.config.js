/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        southwest: {
          blue: '#304CB2',
          red: '#D92228',
          yellow: '#F9B612',
        },
      },
    },
  },
  plugins: [],
} 