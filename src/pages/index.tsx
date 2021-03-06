import * as React from "react"
import { graphql, useStaticQuery } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Card from "../components/Card"
import SloganCarousel, { SloganFragment } from "../components/SloganCarousel"
import RichText from "../components/RichText"
import ConceptTitle from "../components/ConceptTitle"
import { IGatsbyImageData, ImageDataLike } from "gatsby-plugin-image"
import { RichTextFragment } from "../components/RichText/RichText"

interface IndexPageQuery {
  allContentfulStartseite: {
    nodes: Array<{
      slogans: SloganFragment[]
      content: RichTextFragment
      conceptPages: Array<{
        id: string
        title: string
        titleImage?: { gatsbyImageData: IGatsbyImageData }
        slug: string
        shortVideo?: {
          youtubeId: string
          thumb: ImageDataLike
        }
        shortDescription: RichTextFragment
      }>
    }>
  }
}

const IndexPage = () => {
  const {
    allContentfulStartseite: { nodes },
  } = useStaticQuery<IndexPageQuery>(graphql`
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
            shortVideo {
              youtubeId
              thumb {
                childImageSharp {
                  ...CardVideoThumbFragment
                }
              }
            }
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
    <Layout crumbs={[{ title: "Startseite", slug: "" }]}>
      <Seo title="Startseite" />
      <SloganCarousel autoplay slogans={page.slogans} />
      <div className="prose my-8 mx-auto">
        {page.content && <RichText content={page.content} />}
      </div>
      <div className="flex flex-wrap gap-8 m-8 justify-center">
        {page.conceptPages.map(conceptPage => {
          return (
            <Card
              key={conceptPage.id}
              title={
                <ConceptTitle
                  title={conceptPage.title}
                  titleImage={conceptPage.titleImage}
                />
              }
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
