const baseCrumb = { title: "Startseite", slug: "" }

exports.createSchemaCustomization = ({ actions }) => {
  const { createFieldExtension, createTypes } = actions

  createFieldExtension({
    name: "crumbs",
    extend(options, prevFieldConfig) {
      return {
        resolve: async (source, args, context, info) => {
          if (!source.slug) {
            return null
          }

          const crumb = { title: source.title, slug: source.slug }

          if (
            source["concept page___NODE"] &&
            source["concept page___NODE"].length > 0
          ) {
            const parent = await context.nodeModel.getNodeById({
              id: source["concept page___NODE"][0],
            })
            return (
              parent.slug && [
                baseCrumb,
                { title: parent.title, slug: parent.slug },
                crumb,
              ]
            )
          }

          return [baseCrumb, crumb]
        },
      }
    },
  })

  createFieldExtension({
    name: "typesafeReferences",
    extend(options, prevFieldConfig) {
      return {
        resolve: async (source, args, context, info) => {
          return Promise.all(
            source.references___NODE.map(id =>
              context.nodeModel.getNodeById({ id })
            )
          )
        },
      }
    },
  })

  createTypes(`
    union AnyContentType = ContentfulAsset | ContentfulBasicPage | ContentfulConceptPage | ContentfulDetailsPage | ContentfulSlogan

    type Content {
      raw: String
      typesafeReferences: [AnyContentType] @typesafeReferences
    }
    
    type Crumb {
      title: String!
      slug: String!
    }

    interface Linkable {
      crumbs: [Crumb!] @crumbs
    }

    type ContentfulBasicPage implements Linkable {
      crumbs: [Crumb!] @crumbs
      content: Content
    }

    type ContentfulConceptPage implements Linkable {
      crumbs: [Crumb!] @crumbs
      shortDescription: Content
      description: Content
      studentPresentations: Content
      additionalBackground: Content
    }

    type ContentfulDetailsPage implements Linkable {
      crumbs: [Crumb!] @crumbs
      shortDescription: Content
      description: Content
    }
    
  `)
}

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allContentfulConceptPage {
        nodes {
          id
          crumbs {
            title
            slug
          }
          linkedContent {
            id
            crumbs {
              slug
            }
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
          crumbs {
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

  const basicPageTemplate = require.resolve("./src/templates/basicPage.tsx")
  const conceptPageTemplate = require.resolve("./src/templates/conceptPage.tsx")
  const detailsPageTemplate = require.resolve("./src/templates/detailsPage.tsx")
  const pureRichTextPageTemplate = require.resolve(
    "./src/templates/pureRichTextPage.tsx"
  )

  result.data.allContentfulConceptPage.nodes.forEach(conceptPage => {
    const {
      crumbs,
      id,
      linkedContent,
      studentPresentations,
      additionalBackground,
    } = conceptPage
    createPage({
      path: `${crumbs.map(c => c.slug).join("/")}`,
      component: conceptPageTemplate,
      context: { id, crumbs },
    })

    if (linkedContent) {
      linkedContent.forEach(subpage => {
        createPage({
          path: `${subpage.crumbs.map(c => c.slug).join("/")}`,
          component: detailsPageTemplate,
          context: {
            id: subpage.id,
            parentId: id,
          },
        })
      })
    }

    if (studentPresentations) {
      createPage({
        path: `${crumbs
          .map(c => c.slug)
          .join("/")}/weitere-schuelervorstellungen`,
        component: pureRichTextPageTemplate,
        context: {
          content: studentPresentations,
          crumbs: [
            ...crumbs,
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
        path: `${crumbs.map(c => c.slug).join("/")}/weitere-hintergruende`,
        component: pureRichTextPageTemplate,
        context: {
          content: studentPresentations,
          crumbs: [
            ...crumbs,
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
    const { crumbs, id } = basicPage
    createPage({
      path: `${crumbs.map(c => c.slug).join("/")}`,
      component: basicPageTemplate,
      context: { id },
    })
  })
}
