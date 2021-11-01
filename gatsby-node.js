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
          studentPresentations {
            raw
          }
          additionalBackground {
            raw
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
  const pureRichTextPageTemplate = require.resolve(
    "./src/templates/pureRichTextPage.tsx"
  )

  const baseCrumb = { title: "Startseite", slug: "" }

  result.data.allContentfulConceptPage.nodes.forEach(conceptPage => {
    const {
      title,
      slug,
      id,
      linkedContent,
      studentPresentations,
      additionalBackground,
    } = conceptPage
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
            parentId: id,
            crumbs: [
              baseCrumb,
              { title, slug },
              { title: subpage.title, slug: subpage.slug },
            ],
          },
        })
      })
    }

    if (studentPresentations) {
      createPage({
        path: `/${slug}/weitere-schuelervorstellungen`,
        component: pureRichTextPageTemplate,
        context: {
          content: studentPresentations,
          crumbs: [
            baseCrumb,
            { title, slug },
            {
              title: "Weitere Schülervorstellungen",
              slug: "weitere-schuelervorstellungen",
            },
          ],
        },
      })
    }

    if (additionalBackground) {
      createPage({
        path: `/${slug}/weitere-hintergruende`,
        component: pureRichTextPageTemplate,
        context: {
          content: studentPresentations,
          crumbs: [
            baseCrumb,
            { title, slug },
            {
              title: "Weitere Schülervorstellungen",
              slug: "weitere-hintergruende",
            },
          ],
        },
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
