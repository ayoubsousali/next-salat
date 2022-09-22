/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi-Regular', 'sans-serif'],
        sans2: ['Sequel-85', 'sans-serif'],
        serif: ['Evil Empire', 'serif'],
      },
      colors: {
        new_black: 'rgba(0, 0, 0, 1)',
        nt_white: '#E4E4E4',
        nt_d_white: '#9f9f9f',
        nt_black: '#121214',
        nt_red: '#DB2948',
        nt_l_red: '#e5697e',
        nt_d_red: '#6f1222',
        nt_cards_red: '#FD193C',
      },
      backgroundImage: {
        main: "url('/public/images/hero-bg-champions.png')",
      },
    },
  },
  plugins: [],
};
