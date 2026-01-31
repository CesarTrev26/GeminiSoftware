/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './public/admin/**/*.{html,js}',
  ],
  darkMode: 'class',
  safelist: [
    // Keep dynamically-applied utilities for admin panel
    'bg-dark-blue-500',
    'text-dark-blue-500',
    'hover:bg-dark-blue-400',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        // Gemini Brand Colors - Using RGB format for opacity support
        cyan: {
          DEFAULT: 'rgb(0 211 255)',
          50: 'rgb(230 250 255)',
          100: 'rgb(204 245 255)',
          200: 'rgb(153 235 255)',
          300: 'rgb(102 225 255)',
          400: 'rgb(51 215 255)',
          500: 'rgb(0 211 255)',
          600: 'rgb(0 168 204)',
          700: 'rgb(0 126 153)',
          800: 'rgb(0 84 102)',
          900: 'rgb(0 42 51)',
        },
        blue: {
          DEFAULT: 'rgb(0 55 153)',
          50: 'rgb(230 237 255)',
          100: 'rgb(204 218 255)',
          200: 'rgb(153 181 255)',
          300: 'rgb(102 144 255)',
          400: 'rgb(51 107 255)',
          500: 'rgb(0 55 153)',
          600: 'rgb(0 44 122)',
          700: 'rgb(0 33 92)',
          800: 'rgb(0 22 61)',
          900: 'rgb(0 11 31)',
        },
        'dark-blue': {
          DEFAULT: 'rgb(1 24 61)',
          50: 'rgb(230 232 237)',
          100: 'rgb(204 209 218)',
          200: 'rgb(153 163 181)',
          300: 'rgb(102 117 144)',
          400: 'rgb(51 71 107)',
          500: 'rgb(1 24 61)',
          600: 'rgb(1 19 49)',
          700: 'rgb(1 14 37)',
          800: 'rgb(0 10 24)',
          900: 'rgb(0 5 12)',
        },
        gray: {
          DEFAULT: 'rgb(229 230 231)',
          50: 'rgb(250 250 250)',
          100: 'rgb(245 245 245)',
          200: 'rgb(229 230 231)',
          300: 'rgb(212 212 212)',
          400: 'rgb(163 163 163)',
          500: 'rgb(115 115 115)',
          600: 'rgb(82 82 82)',
          700: 'rgb(64 64 64)',
          800: 'rgb(38 38 38)',
          900: 'rgb(23 23 23)',
        },
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'montserrat-alt': ['MontserratAlt1', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'gradient': 'gradient 8s ease infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'text-shimmer': 'textShimmer 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 211, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 211, 255, 0.6)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.2)' },
        },
        textShimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gemini-gradient': 'linear-gradient(135deg, #01183D 0%, #003799 50%, #00D3FF 100%)',
        'gemini-gradient-reverse': 'linear-gradient(135deg, #00D3FF 0%, #003799 50%, #01183D 100%)',
      },
      boxShadow: {
        'glow': '0 0 30px rgba(0, 211, 255, 0.4)',
        'glow-lg': '0 0 60px rgba(0, 211, 255, 0.5)',
        'glow-blue': '0 0 30px rgba(0, 55, 153, 0.4)',
        'inner-glow': 'inset 0 0 30px rgba(0, 211, 255, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    typography,
  ],
};
