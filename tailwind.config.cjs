/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: "kufam, 'Noto Naskh Arabic', serif",
      },
      colors: {
        canvas: "var(--canvas)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        gold: {
          DEFAULT: "var(--gold)",
        },
        dark: "#06110f",
        dark2: "#9bb0aa",
        light: "#f4efe4",
        light2: "#5b6b66",
      },
      boxShadow: {
        card: "0 18px 50px -28px rgba(20, 40, 36, 0.45)",
        hero: "0 24px 60px -24px rgba(7, 28, 26, 0.65)",
      },
      minHeight: {
        touch: "44px",
      },
    },
  },
  plugins: [],
};
