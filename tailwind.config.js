const colors = require("tailwindcss/colors")
const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
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
      fontFamily: {
        sans: ['"Open Sans"', ...defaultTheme.fontFamily.sans],
      },
      typography: theme => ({
        DEFAULT: {
          css: {
            a: {
              color: theme("colors.primary.light"),
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline !important",
              },
              "&:active": {
                textDecoration: "underline !importent",
              },
              "&:visited": {
                color: `${theme("colors.primary.DEFAULT")} !important`,
              },
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
