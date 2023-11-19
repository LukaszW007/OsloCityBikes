/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    screens: {
      'sm': {'max': '640px'},
      'md': {'min': '641px', 'max': '1024'},
      'lg': {'min': '1025px'},
    },
    extend: {
      colors: {
        'custom-blue': '#005fc9',
        'custom-navy': '#0b163f',
      },
      fontSize: {
        clamp: "clamp(0.6rem, 1rem, 1.5rem)",
      },
    },
    
  },
  plugins: [],
}

