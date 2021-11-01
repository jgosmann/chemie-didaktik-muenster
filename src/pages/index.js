import * as React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import { renderRichText } from "gatsby-source-contentful/rich-text"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Card from "../components/card"
import SloganCarousel from "../components/sloganCarousel"
import Breadcrumbs from "../components/breadcrumbs"

const IndexPage = () => {
  const conceptPages = useStaticQuery(graphql`
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
    }
  `).allContentfulConceptPage.nodes

  return (
    <Layout>
      <Seo title="Home" />
      <Breadcrumbs crumbs={[{ title: "Startseite", slug: "" }]} />
      <SloganCarousel />
      <div className="prose my-8 mx-auto">
        <p>
          Herzlich Willkommen auf der Seite des Arbeitskreises von Annette
          Marohn!
        </p>
        <p>
          Hier finden Sie neue Unterrichtskonzepte mit Material, welches Sie
          kostenlos herunterladen und nutzen können.
        </p>
        <p>Wer wir sind und was diese Website soll erfahren Sie TODO.</p>
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
