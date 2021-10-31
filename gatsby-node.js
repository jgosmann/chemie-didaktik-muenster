exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allContentfulConceptPage {
        nodes {
          id
          slug
          linkedContent {
            id
            slug
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  const conceptPageTemplate = require.resolve("./src/templates/conceptPage.tsx")
  const detailsPageTemplate = require.resolve("./src/templates/detailsPage.tsx")

  result.data.allContentfulConceptPage.nodes.forEach(conceptPage => {
    const { slug, id, linkedContent } = conceptPage
    createPage({
      path: `/${slug}`,
      component: conceptPageTemplate,
      context: { id },
    })

    if (linkedContent) {
      linkedContent.forEach(subpage => {
        createPage({
          path: `/${slug}/${subpage.slug}`,
          component: detailsPageTemplate,
          context: { id: subpage.id },
        })
      })
    }
  })
}
