import { graphql } from "gatsby"
import * as React from "react"
import Breadcrumbs from "../components/breadcrumbs"
import Card from "../components/card"
import ConceptNav from "../components/conceptNav"
import Layout from "../components/layout"
import RichText from "../components/richText"
import Seo from "../components/seo"

export const query = graphql`
  query ConceptPageQuery($id: String!) {
    contentfulConceptPage(id: { eq: $id }) {
      title
      slug
      crumbs {
        title
        slug
      }
      longVideo {
        secure_url
      }
      description {
        ...RichTextFragment
      }
      linkedContent {
        id
        title
        crumbs {
          slug
        }
        shortVideo {
          secure_url
        }
        shortDescription {
          ...RichTextFragment
        }
        downloadLink {
          file {
            url
          }
        }
      }
      studentPresentations {
        ...RichTextFragment
      }
      additionalBackground {
        ...RichTextFragment
      }
      ...ConceptNavAuthorMedia
    }
  }
`

const ConceptPage = ({ data }) => {
  const {
    slug,
    crumbs,
    longVideo,
    description,
    linkedContent,
    studentPresentations,
    additionalBackground,
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
        <div className="prose my-8 mx-auto">
          <RichText content={description} />
        </div>
      )}
      <div className="flex flex-wrap gap-8 m-8 justify-center">
        {linkedContent?.map(subpage => (
          <Card
            key={subpage.id}
            title={subpage.title}
            link={subpage.crumbs.map(c => c.slug).join("/")}
            download={subpage.downloadLink?.file.url}
            video={
              subpage.shortVideo?.length > 0 && subpage.shortVideo[0].secure_url
            }
          >
            {subpage.shortDescription && (
              <RichText content={subpage.shortDescription} />
            )}
          </Card>
        ))}
      </div>
      <ConceptNav
        baseSlug={slug}
        hasStudentPresentations={!!studentPresentations}
        hasAdditionalBackground={!!additionalBackground}
        aboutAuthorMedia={data.contentfulConceptPage}
      />
    </Layout>
  )
}

export default ConceptPage
