export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        compliance: {
          50: '#EEF4FB',
          100: '#D4E4F4',
          200: '#A9C9E9',
          400: '#5A96C8',
          600: '#1A4C7C',
          700: '#0F3356',
          800: '#0A2440',
          900: '#081E34',
        },
        'alert-green': '#00A86B',
        gold: '#D4A857',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        heading: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

