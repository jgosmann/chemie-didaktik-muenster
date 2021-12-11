import {
  ContentfulRichTextGatsbyReference,
  RenderRichTextData,
} from "gatsby-source-contentful/rich-text"
import { graphql } from "gatsby"
import * as React from "react"
import { Breadcrumb } from "../components/navigation/Breadcrumbs"
import NavButtons, { AboutAuthorMedia } from "../components/NavButtons"
import Layout from "../components/layout"
import RichText from "../components/RichText"
import Seo from "../components/seo"
import Video from "../components/video"
import { FileNode } from "gatsby-plugin-image/dist/src/components/hooks"

export const query = graphql`
  query DetailsPageQuery($id: String!, $parentId: String!) {
    contentfulDetailsPage(id: { eq: $id }) {
      title
      crumbs {
        title
        slug
      }
      video
      videoThumb {
        childImageSharp {
          gatsbyImageData(layout: FIXED, width: 640, height: 400)
        }
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

interface Parent extends AboutAuthorMedia {
  slug: string
  studentPresentations?: object
  additionalBackground?: object
}

export interface DetailsPageProps {
  data: {
    contentfulDetailsPage: {
      title: string
      crumbs: Breadcrumb[]
      video?: string
      videoThumb?: FileNode
      description: RenderRichTextData<ContentfulRichTextGatsbyReference>
    }
    parent: Parent
  }
}

const DetailsPage = ({ data }: DetailsPageProps) => {
  const {
    contentfulDetailsPage: { title, crumbs, video, videoThumb, description },
    parent,
  } = data
  return (
    <Layout crumbs={crumbs}>
      <Seo title={title} />
      <div className="flex justify-center gap-8 flex-row-reverse flex-wrap my-8 items-start">
        {video && (
          <Video
            url={video}
            thumb={videoThumb}
            className="my-8 mx-auto rounded shadow"
            width="640"
            height="400"
          />
        )}
        <div className="prose">
          {description && <RichText content={description} />}
        </div>
      </div>
      <NavButtons
        baseSlug={parent.slug}
        hasStudentPresentations={!!parent.studentPresentations}
        hasAdditionalBackground={!!parent.additionalBackground}
        aboutAuthorMedia={parent}
      />
    </Layout>
  )
}

export default DetailsPage
