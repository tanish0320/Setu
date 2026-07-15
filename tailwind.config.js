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
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          DEFAULT: '#2563eb',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        // Dark mode specific colors mapping to premium slate/navy cockpit
        dark: {
          bg: '#0b0f19',
          card: '#151d30',
          border: '#222f4c',
          text: '#f8fafc',
          muted: '#94a3b8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        headline: ['Manrope', 'sans-serif'],
        mono: ['Geist', 'monospace'],
      },
      borderRadius: {
        'premium': '12px',
        'super': '18px',
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(37, 99, 235, 0.1)',
        'premium-hover': '0 10px 30px -4px rgba(37, 99, 235, 0.15)',
        'glow-blue': '0 0 20px rgba(37, 99, 235, 0.25)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.3)',
      }
    },
  },
  plugins: [],
}
