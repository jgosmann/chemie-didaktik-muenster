module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  staticDirs: ["./static", "./msw"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  core: {
    builder: "webpack5",
  },
  webpackFinal: async config => {
    // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
    config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/]
    // Use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
    config.module.rules[0].use[0].options.plugins.push(
      require.resolve("babel-plugin-remove-graphql-queries")
    )

    config.module.rules.push({
      test: /\.css$/,
      use: [
        // Loader for webpack to process CSS with PostCSS
        {
          loader: "postcss-loader",
          options: {
            sourceMap: true,
            postcssOptions: {
              path: "./.storybook/",
            },
          },
        },
      ],
    })

    config.resolve.alias["gatsby-original"] = require.resolve("gatsby")
    config.resolve.alias["gatsby"] = require.resolve("./mocks/gatsby.js")
    config.resolve.alias["gatsby-plugin-image-original"] = require.resolve(
      "gatsby-plugin-image"
    )
    config.resolve.alias["gatsby-plugin-image"] = require.resolve(
      "./mocks/gatsby-plugin-image.tsx"
    )

    return config
  },
}
