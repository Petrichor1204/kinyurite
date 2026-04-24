/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Lora', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#f0f5fb',
          100: '#dce8f5',
          200: '#b9d1ea',
          300: '#8eb5d9',
          400: '#6397c6',
          500: '#4a7fb5',
          600: '#3a6699',   // ← sidebar bg — muted steel-blue (was vivid #2563eb)
          700: '#2e5280',
          800: '#223d61',
          900: '#172843',
        },
        accent: {
          100: '#fef9c3',
          200: '#fef08a',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        },
        ink: {
          50:  '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      borderRadius: {
        xl:  '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        card:       '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)',
      }
    },
  },
  plugins: [],
}
 