module.exports = {
  env: {
    es2021: true,
    browser: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:storybook/recommended",
    "plugin:jest-dom/recommended",
  ],
  plugins: ["react", "@typescript-eslint"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: "module",
  },
  settings: { react: { version: "detect" } },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: [
        "eslint:recommended",
        "plugin:storybook/recommended",
        "plugin:jest-dom/recommended",
        "plugin:@typescript-eslint/recommended",
      ],
    },
    {
      files: [
        "e2e.js",
        "gatsby-config.js",
        "gatsby-node.js",
        "jest.config.js",
        "jest-preprocess.js",
        "loadershim.js",
        "postcss.config.js",
        ".storybook/*.js",
        ".storybook/mocks/*.js",
        "tailwind.config.js",
      ],
      env: {
        browser: false,
        node: true,
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
