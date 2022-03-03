const { spawnSync } = require("child_process")
const { createRemoteFileNode } = require("gatsby-source-filesystem")
const OpenAPI = require("openapi-typescript-codegen")
const { resolve } = require("path")
const { extractVideoId } = require("./src/youtube-url-parser")
const crypto = require("crypto")
const http = require("http")
const https = require("https")

require("dotenv").config()

const baseCrumb = { title: "Startseite", slug: "" }

exports.onPreInit = () => {
  const specPath = resolve("./analytics/openapi.json")
  const proc = spawnSync(
    "poetry",
    ["run", "python3", "-m", "cdm_analytics.write_spec", specPath],
    { cwd: "./analytics" }
  )
  if (proc.status != 0) {
    throw "failed to generate analytics client"
  }
  OpenAPI.generate({
    input: specPath,
    output: "./analytics-client",
    clientName: "AnalyticsClient",
  })
}

const obtainAnalyticsToken = () => {
  return new Promise((resolve, reject) => {
    const clientId = process.env.ANALYTICS_BUILDER_CLIENT_ID
    const body = `grant_type=client_credentials&scope=tracked-paths&client_id=${encodeURI(
      clientId
    )}`
    const req = http.request(
      `${process.env.GATSBY_ANALYTICS_URL}/auth/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.ANALYTICS_BUILDER_CLIENT_SECRET}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      res => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(
            new Error(
              `Failed to get authorization to update tracked pages: got ${res.statusCode} HTTP status`
            )
          )
        }
        let chunks = []
        res.on("data", chunk => chunks.push(chunk))
        res.on("end", () => {
          resolve(JSON.parse(chunks.join("")))
        })
      }
    )
    req.on("error", reject)
    req.write(body)
    req.end()
  })
}

const putTrackedPaths = (authToken, paths) => {
  return new Promise((resolve, reject) => {
    const req = http.request(
      `${process.env.GATSBY_ANALYTICS_URL}/tracked/paths`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
      res => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(
            new Error(
              `Failed to update tracked pages: got ${res.statusCode} HTTP status`
            )
          )
        }
        resolve()
      }
    )
    req.on("error", reject)
    req.write(
      JSON.stringify({
        tracked_paths: paths,
      })
    )
    req.end()
  })
}

exports.onPostBuild = async ({ graphql }) => {
  if (!process.env.ANALYTICS_URL) {
    console.warn("ANALYTICS_URL unset, not publishing pages to track.")
    return
  }

  const [pages, tokenResponse] = await Promise.all([
    graphql(`
      {
        allSitePage {
          nodes {
            path
          }
        }
      }
    `),
    obtainAnalyticsToken(),
  ])

  try {
    await putTrackedPaths(
      tokenResponse.access_token,
      pages.data.allSitePage.nodes.map(node => node.path)
    )
  } catch (err) {
    console.error(`Failet to update tracket pages: ${err.message}`, err)
  }
}

const fetchYoutubeVideoData = videoIds =>
  new Promise((resolve, reject) => {
    const url = new URL("https://www.googleapis.com/youtube/v3/videos")
    url.searchParams.set("id", videoIds.join(","))
    url.searchParams.set("key", process.env.YOUTUBE_API_KEY)
    url.searchParams.set("part", "snippet")
    const req = https.request(
      url,
      {
        method: "GET",
      },
      res => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(
            new Error(`Failed to get data for video IDs ${videoIds.join(", ")}`)
          )
        }
        let chunks = []
        res.on("data", chunk => chunks.push(chunk))
        res.on("end", () => {
          resolve(JSON.parse(chunks.join("")).items)
        })
      }
    )
    req.on("error", reject)
    req.end()
  })

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
      video: YtVideo @link
      shortVideo: YtVideo @link
      aboutAuthorVideo: YtVideo @link
    }

    type ContentfulDetailsPage implements Linkable {
      crumbs: [Crumb!]! @crumbs
      shortDescription: Content
      description: Content
      shortVideo: YtVideo @link
    }
    
    type contentfulDetailsPageVideo0TextNode implements Node {
      videos: [YtVideo!]! @link(from: "fields.videos")
    }
    
    type YtVideo implements Node {
      id: ID!
      youtubeId: ID!
      title: String
      thumb: File @link
    }
    
    type ContentfulStartseite implements Linkable {
      crumbs: [Crumb!]! @crumbs
      content: Content
    }    
  `)
}

const createYoutubeThumbFileNode = async (videoData, options) => {
  const sortedUrls = Object.values(videoData.snippet.thumbnails)
    .sort((a, b) => b.width - a.width)
    .map(thumb => thumb.url)

  let lastErr
  for (const url of sortedUrls) {
    try {
      return await createRemoteFileNode({
        ...options,
        url,
      })
    } catch (err) {
      lastErr = err
    }
  }

  throw lastErr
}

exports.onCreateNode = async ({
  node,
  actions: { createNode, createNodeField },
  store,
  cache,
  createNodeId,
}) => {
  const createYoutubeNodes = async (node, fieldName) => {
    const videoIds = node[fieldName]
      .split(/\s+/)
      .map(url => url.trim())
      .filter(url => url !== "")
      .map(extractVideoId)
    const videoData = await fetchYoutubeVideoData(videoIds)
    return await Promise.all(
      videoData.map(async video => {
        const nodeId = createNodeId(`YtVideo-${video.id}`)
        const thumbFileNode = await createYoutubeThumbFileNode(video, {
          parentNodeId: nodeId,
          createNode,
          createNodeId,
          cache,
          store,
        })
        const fieldData = {
          id: nodeId,
          youtubeId: video.id,
          title: video.snippet.title,
          thumb: thumbFileNode.id,
        }
        await createNode({
          ...fieldData,
          parent: node.id,
          children: [],
          internal: {
            type: "YtVideo",
            contentDigest: crypto
              .createHash("md5")
              .update(JSON.stringify(fieldData))
              .digest("hex"),
          },
        })
        return nodeId
      })
    )
  }

  const convertToYoutubeNode = async (node, fieldName) => {
    if (node[fieldName]) {
      const videoIds = await createYoutubeNodes(node, fieldName)
      node[fieldName] = videoIds[0]
    }
  }

  if (node.internal.type === "ContentfulConceptPage") {
    await Promise.all([
      convertToYoutubeNode(node, "shortVideo"),
      convertToYoutubeNode(node, "video"),
      convertToYoutubeNode(node, "aboutAuthorVideo"),
    ])
  } else if (node.internal.type === "ContentfulDetailsPage") {
    await convertToYoutubeNode(node, "shortVideo")
  } else if (node.internal.type === "contentfulDetailsPageVideo0TextNode") {
    const videoNodeIds = await createYoutubeNodes(node, "video0")
    createNodeField({
      node,
      name: `videos`,
      value: videoNodeIds,
    })
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

  const additionalBackgroundPageTemplate = require.resolve(
    "./src/templates/additionalBackgroundPage.tsx"
  )
  const basicPageTemplate = require.resolve("./src/templates/basicPage.tsx")
  const conceptPageTemplate = require.resolve("./src/templates/conceptPage.tsx")
  const detailsPageTemplate = require.resolve("./src/templates/detailsPage.tsx")
  const studentPresentationsPageTemplate = require.resolve(
    "./src/templates/studentPresentationsPage.tsx"
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
        component: studentPresentationsPageTemplate,
        context: {
          id,
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
        component: additionalBackgroundPageTemplate,
        context: {
          id,
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
