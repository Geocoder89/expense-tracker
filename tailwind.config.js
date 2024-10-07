/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-blue': '#19346b',
        'dark-secondary': '#102245'
      }
    },
  },
  plugins: [],
}