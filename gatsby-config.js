require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const extractText = require("./src/components/RichText/extractText")
const extractTextFromContent = content =>
  content ? extractText(JSON.parse(content.raw)) : ""

module.exports = {
  siteMetadata: {
    title: `Chemie-Didaktik Münster`,
    description: ``,
    author: ``,
    siteUrl: `https://keen-goldstine-fde965.netlify.app/`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: `if5ucaiwm6fb`,
        // Learn about environment variables: https://gatsby.dev/env-vars
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-transformer-remark`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#fdba74`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/cdm-favicon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    "gatsby-plugin-postcss",
    {
      resolve: "gatsby-plugin-local-search",
      options: {
        name: "pages",
        engine: "flexsearch",
        query: `
          {
            allContentfulBasicPage {
              nodes {
                id
                crumbs {
                  slug
                  title
                }
                title
                content {
                  raw
                }
              }
            }
            allContentfulConceptPage {
              nodes {
                id
                crumbs {
                  slug
                  title
                }
                description {
                  raw
                }
                additionalBackground {
                  raw
                }
                shortDescription {
                  raw
                }
                studentPresentations {
                  raw
                }
                title
              }
            }
            allContentfulDetailsPage {
              nodes {
                id
                crumbs {
                  slug
                  title
                }
                description {
                  raw
                }
                shortDescription {
                  raw
                }
                title
              }
            }
            allContentfulStartseite {
              nodes {
                id
                content {
                  raw
                }
                crumbs {
                  slug
                  title
                }
                title
              }
            }
          }
        `,
        normalizer: ({ data }) => [
          ...data.allContentfulBasicPage.nodes.map(page => ({
            crumbs: page.crumbs,
            title: page.title,
            content: extractTextFromContent(page.content),
          })),
          ...data.allContentfulConceptPage.nodes.flatMap(page => [
            {
              id: page.id,
              crumbs: page.crumbs,
              title: page.title,
              content:
                extractTextFromContent(page.shortDescription) +
                " " +
                extractTextFromContent(page.description),
            },
            {
              id: `${page.id}-hintergruende`,
              crumbs: [
                page.crumbs,
                {
                  title: "Weitere Hintergründe",
                  slug: "weitere-hintergruende",
                },
              ],
              title: "Weitere Hintergründe",
              content: extractTextFromContent(page.additionalBackground),
            },
            {
              id: `${page.id}-schuelervorstellungen`,
              crumbs: [
                page.crumbs,
                {
                  title: "Weitere Schülervorstellungen",
                  slug: "weitere-schuelervorstellungen",
                },
              ],
              title: "Weitere Schülervorstellungen",
              content: extractTextFromContent(page.studentPresentations),
            },
          ]),
          ...data.allContentfulDetailsPage.nodes.map(page => ({
            id: page.id,
            crumbs: page.crumbs,
            title: page.title,
            content:
              extractTextFromContent(page.shortDescription) +
              " " +
              extractTextFromContent(page.description),
          })),
          ...data.allContentfulStartseite.nodes.map(page => ({
            id: page.id,
            crumbs: page.crumbs,
            title: page.title,
            content: extractTextFromContent(page.content),
          })),
        ],
      },
      index: ["title", "content"],
      store: ["crumbs", "title"],
    },
  ],
}
