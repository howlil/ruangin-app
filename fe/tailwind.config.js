/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors :{
        primary : '#187CFF',
        secunder : '#F4FAFF'

      }
    },
  },
  plugins: [],
}