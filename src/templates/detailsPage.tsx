import { graphql } from "gatsby"
import * as React from "react"
import YouTube from "react-youtube"
import Breadcrumbs from "../components/breadcrumbs"
import ConceptNav from "../components/conceptNav"
import Layout from "../components/layout"
import RichText from "../components/richText"
import Seo from "../components/seo"
import Video from "../components/video"

export const query = graphql`
  query DetailsPageQuery($id: String!, $parentId: String!) {
    contentfulDetailsPage(id: { eq: $id }) {
      title
      crumbs {
        title
        slug
      }
      video
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
    contentfulDetailsPage: { title, crumbs, video, description },
    parent,
  } = data
  return (
    <Layout crumbs={crumbs}>
      <Seo title={title} />
      <div className="flex justify-center gap-8 flex-row-reverse flex-wrap my-8 items-start">
        {video && (
          <Video
            url={video}
            className="my-8 mx-auto rounded shadow"
            width="640"
            height="400"
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
