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
        ivory: '#F8F3EB',
        espresso: {
          50: '#F5F2F0',
          100: '#E6DFDB',
          500: '#5A3D30',
          800: '#38251D',
          900: '#241611',
          950: '#180E0A',
        },
        caramel: {
          400: '#D99B6A',
          500: '#C58B59',
          600: '#B07545',
        },
        sage: '#A6B49A',
        peach: '#EAC8AE',
        charcoal: '#24211F',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        '25d': '0 20px 50px -10px rgba(24, 14, 10, 0.4), 0 10px 20px -5px rgba(197, 139, 89, 0.2)',
        '25d-hover': '0 30px 60px -12px rgba(24, 14, 10, 0.6), 0 15px 25px -5px rgba(197, 139, 89, 0.35)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'steam-rise': 'steam 3s ease-out infinite',
        'pulse-glow': 'pulseGlow 2.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(3deg)' },
        },
        steam: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.6' },
          '50%': { transform: 'translateY(-20px) scale(1.2)', opacity: '0.3' },
          '100%': { transform: 'translateY(-40px) scale(1.4)', opacity: '0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
