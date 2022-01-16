const { createRemoteFileNode } = require("gatsby-source-filesystem")
const { extractVideoId } = require("./src/youtube-url-parser")

const baseCrumb = { title: "Startseite", slug: "" }

exports.createSchemaCustomization = ({ actions }) => {
  const { createFieldExtension, createTypes } = actions

  createFieldExtension({
    name: "crumbs",
    extend(options, prevFieldConfig) {
      return {
        resolve: async (source, args, context, info) => {
          if (source.internal.type === "ContentfulStartseite") {
            return [baseCrumb]
          }

          if (!source.slug) {
            console.log(source)
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
    name: "videoIds",
    args: { source: "String" },
    extend({ source: sourceField }, prevFieldConfig) {
      return {
        resolve: async (source, args, context, info) => {
          return source[sourceField]
            .split(/\s+/)
            .map(url => url.trim())
            .filter(url => url !== "")
            .map(extractVideoId)
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
      crumbs: [Crumb!]! @crumbs
    }

    type ContentfulBasicPage implements Linkable {
      crumbs: [Crumb!]! @crumbs
      content: Content
    }

    type ContentfulConceptPage implements Linkable {
      crumbs: [Crumb!]! @crumbs
      shortDescription: Content
      description: Content
      studentPresentations: Content
      additionalBackground: Content
      shortVideoThumb: File @link(from: "fields.shortVideoThumb")
      videoThumb: File @link(from: "fields.videoThumb")
      abourtAuthorVideoThumb: File @link(from: "fields.aboutAuthorVideoThumb")
    }

    type ContentfulDetailsPage implements Linkable {
      crumbs: [Crumb!]! @crumbs
      shortDescription: Content
      description: Content
      shortVideoThumb: File @link(from: "fields.shortVideoThumb")
    }
    
    type contentfulDetailsPageVideo0TextNode implements Node {
      videoIds: [String!]! @videoIds(source: "video0")
      videoThumbs: [File!]! @link(from: "fields.video0Thumbs")
    }
    
    type ContentfulStartseite implements Linkable {
      crumbs: [Crumb!]! @crumbs
      content: Content
    }    
  `)
}

const createYoutubeThumbFileNode = async (videoId, options) => {
  try {
    return await createRemoteFileNode({
      ...options,
      url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    })
  } catch (err) {
    return await createRemoteFileNode({
      ...options,
      url: `https://img.youtube.com/vi/${videoId}/default.jpg`,
    })
  }
}

exports.onCreateNode = async ({
  node,
  actions: { createNode, createNodeField },
  store,
  cache,
  createNodeId,
}) => {
  const createYoutubeThumbNode = async fieldName => {
    if (node[fieldName]) {
      const videoId = extractVideoId(node[fieldName])
      let fileNode = await createYoutubeThumbFileNode(videoId, {
        parentNodeId: node.id,
        createNode,
        createNodeId,
        cache,
        store,
      })
      if (fileNode) {
        createNodeField({ node, name: `${fieldName}Thumb`, value: fileNode.id })
      }
    }
  }

  const createMultipleYoutubeThumbNode = async fieldName => {
    const videoIds = node[fieldName]
      .split(/\s+/)
      .map(url => url.trim())
      .filter(url => url !== "")
      .map(extractVideoId)
    const fileNodes = await Promise.all(
      videoIds.map(videoId => {
        console.log(`create node for ${videoId}`)
        return createYoutubeThumbFileNode(videoId, {
          parentNodeId: node.id,
          createNode,
          createNodeId,
          cache,
          store,
        })
      })
    )

    createNodeField({
      node,
      name: `${fieldName}Thumbs`,
      value: fileNodes.map(node => node.id),
    })
  }

  if (node.internal.type === "ContentfulConceptPage") {
    await Promise.all([
      createYoutubeThumbNode("shortVideo"),
      createYoutubeThumbNode("video"),
      createYoutubeThumbNode("aboutAuthorVideo"),
    ])
  } else if (node.internal.type === "ContentfulDetailsPage") {
    await createYoutubeThumbNode("shortVideo")
  } else if (node.internal.type === "contentfulDetailsPageVideo0TextNode") {
    await createMultipleYoutubeThumbNode("video0")
  }
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

      allContentfulBasicPage {
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
    // eslint-disable-next-line no-undef
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
          title: "Weitere Schülervorstellungen",
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
          content: additionalBackground,
          title: "Weitere Hintergründe",
          crumbs: [
            ...crumbs,
            {
              title: "Weitere Hintergründe",
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
