module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Escanea todos los archivos React
    './src/**/*.css',             // Escanea archivos CSS
  ],
  theme: {
    extend: {
      colors: {
        'verde-brillante': '#6DA544',
        'verde-lima-claro': '#C3D18D',
        'verde-aqua': '#A8CDBD',
        'verde-medio': '#6FA575',
        'verde-profundo': '#2E5C3F',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};