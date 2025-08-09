/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand core colors (provided school colors)
        'grayson-green': 'hsl(142 39% 22%)',
        'grayson-navy': 'hsl(201 100% 14%)',
        'grayson-gold': 'hsl(51 99% 47%)',
        // Derived tonal shades for nuanced UI states
        'grayson-green-soft': 'hsl(142 39% 22% / 0.08)',
        'grayson-green-alt': 'hsl(142 39% 28%)',
        'grayson-navy-soft': 'hsl(201 100% 14% / 0.08)',
        'grayson-navy-alt': 'hsl(201 100% 20%)',
        'grayson-gold-soft': 'hsl(51 99% 47% / 0.12)',
        'grayson-gold-alt': 'hsl(51 99% 55%)',
        // Semantic aliases
        'primary': 'hsl(142 39% 22%)',
        'primary-hover': 'hsl(142 39% 28%)',
        'secondary': 'hsl(201 15% 55%)',
        'danger': 'hsl(0 75% 52%)',
        'surface': 'hsl(210 30% 98%)',
        'surface-alt': 'hsl(210 30% 96%)',
        'surface-dark': 'hsl(201 100% 8%)',
        'border-subtle': 'hsl(210 20% 90%)',
        'border-strong': 'hsl(210 15% 80%)',
      },
      spacing: {
        'section': '2rem',
        'container': '1rem',
      },
      borderRadius: {
        'container': '0.75rem',
      },
      fontFamily: {
        sans: [
          'Inter Variable',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
        ],
      },
      backgroundImage: {
        'gradient-radial-gold': 'radial-gradient(circle at 30% 30%, hsl(51 99% 47% / 0.22), transparent 70%)',
        'gradient-radial-green': 'radial-gradient(circle at 70% 70%, hsl(142 39% 22% / 0.18), transparent 75%)',
        'gradient-conic-brand': 'conic-gradient(from 180deg at 50% 50%, hsl(51 99% 47%), hsl(142 39% 22%), hsl(201 100% 14%), hsl(51 99% 47%))',
        'gradient-brand-linear': 'linear-gradient(135deg, hsl(201 100% 14%) 0%, hsl(142 39% 22%) 55%, hsl(51 99% 47%) 110%)',
      },
      boxShadow: {
        'brand-soft': '0 4px 16px -2px hsl(201 100% 14% / 0.25), 0 2px 4px -1px hsl(142 39% 22% / 0.15)',
        'brand-glow': '0 0 0 1px hsl(51 99% 47% / 0.4), 0 0 0 4px hsl(51 99% 47% / 0.15)',
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease forwards',
        'rise': 'rise 0.6s cubic-bezier(.21,.72,.31,1.02) forwards',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'rise': { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
