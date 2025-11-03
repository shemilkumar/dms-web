/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#008000",
        secondary: "#0066cc",
        tertiary: "#f5a623",
      },
    },
  },
  plugins: [],
}