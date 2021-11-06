import * as React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Card from "../components/card"
import SloganCarousel from "../components/sloganCarousel"
import Breadcrumbs from "../components/breadcrumbs"
import RichText from "../components/richText"

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
            ...RichTextFragment
          }
          video: childContentfulConceptPageShortVideoJsonNode {
            secure_url
          }
        }
      }
      contentfulBasicPage(slug: { eq: "einleitungstext" }) {
        content {
          ...RichTextFragment
        }
      }
    }
  `)

  return (
    <Layout>
      <Seo title="Home" />
      <Breadcrumbs crumbs={[{ title: "Startseite", slug: "" }]} />
      <SloganCarousel />
      <div className="prose my-8 mx-auto">
        {contentfulBasicPage?.content && (
          <RichText content={contentfulBasicPage.content} />
        )}
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
              {conceptPage.shortDescription && (
                <RichText content={conceptPage.shortDescription} />
              )}
            </Card>
          )
        })}
      </div>
    </Layout>
  )
}

export default IndexPage
