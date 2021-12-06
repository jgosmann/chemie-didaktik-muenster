module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:storybook/recommended",
    "plugin:jest-dom/recommended",
  ],
  overrides: [
    {
      files: ["gatsby-browser.js", ".storybook/*.js"],
      parserOptions: {
        sourceType: "module",
      },
    },
    {
      files: [".storybook/preview.js"],
      env: {
        browser: true,
      },
    },
    {
      files: ["gatsby-node.js"],
      rules: {
        "no-unused-vars": [
          "error",
          {
            args: "none",
          },
        ],
      },
    },
  ],
}
