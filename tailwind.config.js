/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite-react/**/*.js",
  ],
  theme: {
    extend: {
      screens: {
        'sm': { 'max': '768px' }
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
  darkMode: "class"
}

