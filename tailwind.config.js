const colors = require("tailwindcss/colors")

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
      typography: theme => ({
        DEFAULT: {
          css: {
            a: {
              color: theme("colors.secondary.600"),
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline !important",
              },
              "&:active": {
                textDecoration: "underline !importent",
              },
              "&:visited": {
                color: `${theme("colors.secondary.800")} !important`,
              },
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
