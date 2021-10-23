const { table } = require("console")
const colors = require("tailwindcss/colors")

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      primary: colors.orange,
      secondary: colors.blue,
      white: colors.white,
      gray: colors.gray,
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
}
