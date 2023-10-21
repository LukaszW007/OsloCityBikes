/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
    ],

    theme: {
        extend: {
            colors: {
                'custom-blue': '#005fc9',
                'custom-navy': '#0b163f',
            }
        },
  },
  plugins: [],
}

