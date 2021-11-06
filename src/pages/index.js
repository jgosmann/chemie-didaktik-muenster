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
    allContentfulStartseite: { nodes },
  } = useStaticQuery(graphql`
    query ConceptPagesQuery {
      allContentfulStartseite(limit: 1) {
        nodes {
          slogans {
            ...SloganFragment
          }
          content {
            ...RichTextFragment
          }
          conceptPages {
            id
            title
            titleImage {
              gatsbyImageData(layout: CONSTRAINED, height: 24)
            }
            slug
            shortVideo
            shortDescription {
              ...RichTextFragment
            }
          }
        }
      }
    }
  `)
  const page = nodes[0]

  return (
    <Layout>
      <Seo title="Home" />
      <Breadcrumbs crumbs={[{ title: "Startseite", slug: "" }]} />
      <SloganCarousel slogans={page.slogans} />
      <div className="prose my-8 mx-auto">
        {page.content && <RichText content={page.content} />}
      </div>
      <div className="flex flex-wrap gap-8 m-8 justify-center">
        {page.conceptPages.map(conceptPage => {
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
              video={conceptPage.shortVideo}
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
