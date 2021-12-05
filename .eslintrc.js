module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended"],
  overrides: [
    {
      files: ["gatsby-browser.js"],
      parserOptions: {
        sourceType: "module",
      },
    },
    {
      files: ["gatsby-node.js"],
      rules: {
        "no-unused-vars": ["error", { args: "none" }],
      },
    },
  ],
}
