import * as React from "react"
import { graphql, useStaticQuery } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Card from "../components/card"
import SloganCarousel from "../components/sloganCarousel"
import RichText from "../components/richText"
import ConceptTitle from "../components/conceptTitle"

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
    <Layout crumbs={[{ title: "Startseite", slug: "" }]}>
      <Seo title="Startseite" />
      <SloganCarousel slogans={page.slogans} />
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
