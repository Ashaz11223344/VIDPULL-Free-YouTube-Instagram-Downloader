/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          bg: '#FFFDF5',
          black: '#000000',
          accent: '#FF6B6B',
          secondary: '#FFD93D',
          muted: '#C4B5FD',
          white: '#FFFFFF',
          green: '#4ADE80',
          cyan: '#38BDF8',
          pink: '#F472B6',
        }
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'neo-xs': '2px 2px 0px 0px #000000',
        'neo-sm': '4px 4px 0px 0px #000000',
        'neo': '8px 8px 0px 0px #000000',
        'neo-lg': '12px 12px 0px 0px #000000',
        'neo-xl': '16px 16px 0px 0px #000000',
        'neo-2xl': '20px 20px 0px 0px #000000',
        'neo-white-sm': '4px 4px 0px 0px #FFFFFF',
        'neo-white': '8px 8px 0px 0px #FFFFFF',
        'neo-white-lg': '12px 12px 0px 0px #FFFFFF',
        'neo-white-xl': '16px 16px 0px 0px #FFFFFF',
      },
      borderWidth: {
        '3': '3px',
        '6': '6px',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
        'bounce-subtle': 'bounce-subtle 2s infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(-3%)' },
          '50%': { transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
