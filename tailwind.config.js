/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        halloween: {
          orange: '#FF6B1A',
          purple: '#6B2D5C',
          black: '#1A1A1A',
          white: '#F5F5F5',
          green: '#4A7C59',
          darkPurple: '#2D1B3D',
          lightOrange: '#FFA500',
        }
      },
      fontFamily: {
        creepy: ['Creepster', 'cursive'],
        halloween: ['Nosifer', 'cursive'],
      },
      backgroundImage: {
        'halloween-gradient': 'linear-gradient(135deg, #2D1B3D 0%, #1A1A1A 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}