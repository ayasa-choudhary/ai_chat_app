/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          dark: '#4338CA',
          light: '#818CF8',
        },
        secondary: {
          DEFAULT: '#10B981',
          dark: '#059669',
          light: '#34D399',
        },
        background: {
          light: '#FFFFFF',
          dark: '#111827',
        },
        text: {
          light: '#1F2937',
          dark: '#F9FAFB',
          muted: {
            light: '#6B7280',
            dark: '#9CA3AF',
          },
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}