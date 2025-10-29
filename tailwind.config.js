/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0B0F1A',
        neon: '#00D4FF',
        lavender: '#A970FF'
      },
      fontFamily: {
        sans: ['"Inter"', '"Poppins"', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        '2xl': '1.5rem'
      },
      boxShadow: {
        glow: '0 0 30px rgba(0, 212, 255, 0.5)',
        card: '0 20px 50px rgba(11, 15, 26, 0.45)'
      }
    }
  },
  plugins: []
};
