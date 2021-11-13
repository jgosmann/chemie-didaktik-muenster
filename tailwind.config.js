const { table } = require("console")
const colors = require("tailwindcss/colors")

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      primary: {
        light: "#f77a40",
        DEFAULT: "#e9530e",
      },
      secondary: colors.blue,
      red: colors.red,
      white: colors.white,
      gray: colors.gray,
      black: colors.black,
    },
    extend: {
      typography: theme => ({
        DEFAULT: {
          css: {
            a: {
              color: theme("colors.secondary.600"),
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
              "&:active": {
                textDecoration: "underline",
              },
              "&:visited": {
                color: theme("colors.secondary.800"),
              },
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {
      ringWidth: ["hover", "active"],
      textColor: ["visited", "active"],
      textDecoration: ["active"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
