/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./assets/app.js", "./assets/dj-ai.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        display: ['"Covered By Your Grace"', 'cursive'],
        mono: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        acid: '#DFFF00',
        cyan: '#00F0FF',
        neo: '#F8D8FF'
      }
    },
  },
  plugins: [],
}

