exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allContentfulConceptPage {
        nodes {
          id
          title
          slug
          linkedContent {
            id
            title
            slug
          }
        }
      }

      allContentfulBasicPage(filter: { isInlineContentOnly: { eq: false } }) {
        nodes {
          id
          title
          slug
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  const basicPageTemplate = require.resolve("./src/templates/basicPage.tsx")
  const conceptPageTemplate = require.resolve("./src/templates/conceptPage.tsx")
  const detailsPageTemplate = require.resolve("./src/templates/detailsPage.tsx")

  const baseCrumb = { title: "Startseite", slug: "" }

  result.data.allContentfulConceptPage.nodes.forEach(conceptPage => {
    const { title, slug, id, linkedContent } = conceptPage
    createPage({
      path: `/${slug}`,
      component: conceptPageTemplate,
      context: { id, crumbs: [baseCrumb, { title, slug }] },
    })

    if (linkedContent) {
      linkedContent.forEach(subpage => {
        createPage({
          path: `/${slug}/${subpage.slug}`,
          component: detailsPageTemplate,
          context: {
            id: subpage.id,
            crumbs: [
              baseCrumb,
              { title, slug },
              { title: subpage.title, slug: subpage.slug },
            ],
          },
        })
      })
    }
  })

  result.data.allContentfulBasicPage.nodes.forEach(basicPage => {
    const { title, slug, id } = basicPage
    createPage({
      path: `/${slug}`,
      component: basicPageTemplate,
      context: { id, crumbs: [baseCrumb, { title, slug }] },
    })
  })
}
