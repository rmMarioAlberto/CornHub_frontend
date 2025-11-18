export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './src/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        'verde-brillante': '#6DA544',
        'verde-lima-claro': '#C3D18D',
        'verde-aqua': '#A8CDBD',
        'verde-medio': '#6FA575',
        'verde-profundo': '#2E5C3F',
        'gris-suave': '#F5F5F5',
        'negro-texto': '#1A1A1A',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      spacing: {
        '4.5': '1.125rem',
      },
      boxShadow: {
        'custom-light': '0 1px 3px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'zoom-in-95': 'zoomIn95 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        zoomIn95: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};