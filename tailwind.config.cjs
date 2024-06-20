/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: "kufam, serif",
      },
      colors: {
        dark: "#1c1c1e",
        dark2: "#8e8e93",
        light: "#f2f2f7",
        light2: "#8e8e93",
      },
    },
  },
  plugins: [],
};
