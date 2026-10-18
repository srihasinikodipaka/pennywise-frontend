/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Specific Pennywise Visual System Palette
        penny: {
          'light-blue': '#E8F3FF',
          'secondary-blue': '#BBD9F5',
          'action-blue': '#477EAD',
          'action-hover': '#396992',
          'butter-yellow': '#F8E7A1',
          'yellow-light': '#FDF8E2',
          'ivory': '#FAF9F5',
          'surface': '#FFFFFF',
          'navy': '#24364B',
          'navy-dark': '#192635',
          'secondary-text': '#687789',
          'sage': '#DDEFE4',
          'sage-dark': '#2B6A43',
          'lilac': '#E9E5F8',
          'border': '#E6E8EC',
          'border-subtle': '#F0F2F5',
          'rose-soft': '#FDE8E8',
          'rose-text': '#9B2C2C',
          'amber-soft': '#FEF3C7',
          'amber-text': '#92400E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(36, 54, 75, 0.04), 0 1px 2px 0 rgba(36, 54, 75, 0.02)',
        'card-hover': '0 4px 12px 0 rgba(36, 54, 75, 0.07), 0 2px 4px 0 rgba(36, 54, 75, 0.04)',
        'modal': '0 10px 25px -5px rgba(36, 54, 75, 0.12), 0 8px 10px -6px rgba(36, 54, 75, 0.08)',
      }
    },
  },
  plugins: [],
}
