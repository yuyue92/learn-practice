/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#b6d7ff',
          300: '#85bcff',
          400: '#4c97ff',
          500: '#1f6fff',
          600: '#1a57db',
          700: '#1747b1',
          800: '#163d8c',
          900: '#15356f'
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          700: '#15803d'
        },
        danger: {
          50: '#fef2f2',
          500: '#ef4444',
          700: '#b91c1c'
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          700: '#b45309'
        }
      }
    }
  },
  plugins: []
};
