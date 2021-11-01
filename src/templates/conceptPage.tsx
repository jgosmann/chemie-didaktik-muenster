import { graphql, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { renderRichText } from "gatsby-source-contentful/rich-text"
import * as React from "react"
import Breadcrumbs from "../components/breadcrumbs"
import BtnLink from "../components/btnLink"
import Card from "../components/card"
import ConceptNav from "../components/conceptNav"
import FaqBtnLink from "../components/faqBtnLink"
import Layout from "../components/layout"
import Seo from "../components/seo"

export const query = graphql`
  query ConceptPageQuery($id: String!) {
    contentfulConceptPage(id: { eq: $id }) {
      title
      slug
      longVideo {
        secure_url
      }
      description {
        raw
      }
      linkedContent {
        id
        title
        slug
        shortVideo {
          secure_url
        }
        shortDescription {
          raw
        }
        downloadLink {
          file {
            url
          }
        }
      }
      studentPresentations {
        raw
      }
      additionalBackground {
        raw
      }
      aboutAuthor {
        secure_url
      }
    }
  }
`

const ConceptPage = ({ data, pageContext: { crumbs } }) => {
  const {
    slug,
    longVideo,
    description,
    linkedContent,
    studentPresentations,
    additionalBackground,
    aboutAuthor,
  } = data.contentfulConceptPage
  return (
    <Layout>
      <Seo title="Page two" />
      <Breadcrumbs crumbs={crumbs} />
      {longVideo && longVideo.length > 0 && (
        <video
          controls
          src={longVideo[0].secure_url}
          className="my-8 mx-auto rounded shadow"
          style={{ maxHeight: "50vh" }}
        />
      )}
      {description && (
        <div className="prose my-8 mx-auto">{renderRichText(description)}</div>
      )}
      <div className="flex flex-wrap gap-8 m-8 justify-center">
        {linkedContent?.map(subpage => (
          <Card
            key={subpage.id}
            title={subpage.title}
            link={["", slug, subpage.slug].join("/")}
            download={subpage.downloadLink?.file.url}
            video={
              subpage.shortVideo?.length > 0 && subpage.shortVideo[0].secure_url
            }
          >
            {subpage.shortDescription &&
              renderRichText(subpage.shortDescription)}
          </Card>
        ))}
      </div>
      <ConceptNav
        baseSlug={slug}
        hasStudentPresentations={!!studentPresentations}
        hasAdditionalBackground={!!additionalBackground}
        aboutAuthorVideoUrl={
          aboutAuthor && aboutAuthor.length > 0 && aboutAuthor[0].secure_url
        }
      />
    </Layout>
  )
}

export default ConceptPage
