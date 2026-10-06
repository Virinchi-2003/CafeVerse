/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#006A4E', // Blackstarz Green from Image 2 reference
        ivory: '#F8F3EB',
        espresso: {
          800: '#38251D',
          900: '#241611',
          950: '#180E0A',
        },
        caramel: '#C58B59',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
