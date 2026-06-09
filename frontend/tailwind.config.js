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
        primary: {
          50: '#e7f1ff',
          100: '#c4d9ff',
          200: '#9ebfff',
          300: '#6fa0ff',
          400: '#4a85ff',
          500: '#007bff',
          600: '#0069d9',
          700: '#0056b3',
          800: '#00408c',
          900: '#002d66',
        },
        adminlte: {
          bg: '#f4f6f9',
          'bg-dark': '#1a1d21',
          card: '#ffffff',
          'card-dark': '#212529',
          sidebar: '#343a40',
          border: '#dee2e6',
          'border-dark': '#343a40',
          navy: '#343a40',
          text: '#495057',
          'text-dark': '#ced4da',
          muted: '#6c757d',
          success: '#28a745',
          danger: '#dc3545',
          warning: '#ffc107',
          info: '#17a2b8',
        },
      },
      fontFamily: {
        sans: ['Source Sans 3', 'Source Sans Pro', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
