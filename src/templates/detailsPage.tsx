import { graphql } from "gatsby"
import * as React from "react"
import Breadcrumbs from "../components/breadcrumbs"
import ConceptNav from "../components/conceptNav"
import Layout from "../components/layout"
import RichText from "../components/richText"
import Seo from "../components/seo"

export const query = graphql`
  query DetailsPageQuery($id: String!, $parentId: String!) {
    contentfulDetailsPage(id: { eq: $id }) {
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
    }
    parent: contentfulConceptPage(id: { eq: $parentId }) {
      slug
      studentPresentations {
        raw
      }
      additionalBackground {
        raw
      }
      ...ConceptNavAuthorMedia
    }
  }
`

const DetailsPage = ({ data }) => {
  const {
    contentfulDetailsPage: { crumbs, longVideo, description },
    parent,
  } = data
  return (
    <Layout>
      <Seo title="Page two" />
      <Breadcrumbs crumbs={crumbs} />
      <div className="flex justify-center gap-8 flex-row-reverse flex-wrap my-8 items-start">
        {longVideo && longVideo.length > 0 && (
          <video
            controls
            src={longVideo[0].secure_url}
            className="my-8 mx-auto rounded shadow"
            style={{ maxHeight: "50vh" }}
          />
        )}
        <div className="prose">
          {description && <RichText content={description} />}
        </div>
      </div>
      <ConceptNav
        baseSlug={parent.slug}
        hasStudentPresentations={!!parent.studentPresentations}
        hasAdditionalBackground={!!parent.additionalBackground}
        aboutAuthorMedia={parent}
      />
    </Layout>
  )
}

export default DetailsPage
