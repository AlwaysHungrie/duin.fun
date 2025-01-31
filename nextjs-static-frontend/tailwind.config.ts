import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        homeBg: '#E7E6F0',
        brand: '#FA3B6A',
        secondaryAccent: '#E0DFEF',
      },
      fontFamily: {
        redditSans: ['var(--font-reddit-sans)'],
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': {
            transform: 'translateY(-25%)',
          },
          '50%': {
            transform: 'translateY(0)',
          },
        },
      },
      screens: {
        xl2: '1422px',
      },
      animation: {
        'spin-slow': 'spin 60s linear infinite',
        'bounce-slow': 'bounce-slow 60s ease-in-out infinite',
        'spin-slow-mobile': 'spin 30s linear infinite',
        'bounce-slow-mobile': 'bounce-slow 30s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
