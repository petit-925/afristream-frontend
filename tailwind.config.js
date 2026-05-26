/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF3D3D',
          dark: '#D62C2C',
          light: '#FF6B6B',
        },
        dark: {
          DEFAULT: '#121212',
          lighter: '#1E1E1E',
          darker: '#0A0A0A',
          900: '#000000',
          800: '#0D0D0D',
          700: '#1A1A1A',
          600: '#262626',
        },
        light: {
          DEFAULT: '#FFFFFF',
          darker: '#F0F0F0',
          gray: '#AAAAAA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(255, 61, 61, 0.5)',
        'glow-sm': '0 0 8px rgba(255, 61, 61, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};