import * as React from "react"
import { INLINES } from "@contentful/rich-text-types"
import { graphql, Link, useStaticQuery } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import { renderRichText } from "gatsby-source-contentful/rich-text"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Card from "../components/card"
import SloganCarousel from "../components/sloganCarousel"
import Breadcrumbs from "../components/breadcrumbs"

const IndexPage = () => {
  const {
    allContentfulConceptPage: { nodes: conceptPages },
    contentfulBasicPage,
  } = useStaticQuery(graphql`
    query ConceptPagesQuery {
      allContentfulConceptPage {
        nodes {
          id
          title
          titleImage {
            gatsbyImageData(layout: CONSTRAINED, height: 24)
          }
          slug
          shortDescription {
            raw
          }
          video: childContentfulConceptPageShortVideoJsonNode {
            secure_url
          }
        }
      }
      contentfulBasicPage(slug: { eq: "einleitungstext" }) {
        content {
          raw
          references {
            contentful_id
            __typename
            slug
          }
        }
      }
    }
  `)

  const richTextRenderOptions = {
    renderNode: {
      [INLINES.ENTRY_HYPERLINK]: ({ data }, children) => (
        <Link to={`/${data.target.slug}`}>{children}</Link>
      ),
    },
  }

  return (
    <Layout>
      <Seo title="Home" />
      <Breadcrumbs crumbs={[{ title: "Startseite", slug: "" }]} />
      <SloganCarousel />
      <div className="prose my-8 mx-auto">
        {contentfulBasicPage?.content &&
          renderRichText(contentfulBasicPage.content, richTextRenderOptions)}
      </div>
      <div className="flex flex-wrap gap-8 m-8 justify-center">
        {conceptPages.map(conceptPage => {
          const titleImage = conceptPage.titleImage && (
            <GatsbyImage
              image={conceptPage.titleImage.gatsbyImageData}
              alt={conceptPage.title}
            />
          )
          return (
            <Card
              key={conceptPage.id}
              title={titleImage || conceptPage.title}
              link={"/" + conceptPage.slug}
              video={conceptPage.video.secure_url}
            >
              {conceptPage.shortDescription &&
                renderRichText(conceptPage.shortDescription)}
            </Card>
          )
        })}
      </div>
    </Layout>
  )
}

export default IndexPage
