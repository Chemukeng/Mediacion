/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#1a3e31",
          "green-light": "#2c5949",
          gold: "#c0995c",
          cream: "#fbf9f4",
          dark: "#2a3132",
        },
      },
    },
  },
  plugins: [],
}
