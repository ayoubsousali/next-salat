/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: 'Noto Naskh Arabic, serif',
      },
      colors: {
        dark: '#121212',
        dark2: '#424242',
        light: '#DEE4E7',
        light2: '#EEE',
      }
    }
  },
  plugins: [],
}
