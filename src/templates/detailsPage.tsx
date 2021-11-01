import { INLINES } from "@contentful/rich-text-types"
import { graphql } from "gatsby"
import { renderRichText } from "gatsby-source-contentful/rich-text"
import * as React from "react"
import Breadcrumbs from "../components/breadcrumbs"
import ConceptNav from "../components/conceptNav"
import Layout from "../components/layout"
import Seo from "../components/seo"

export const query = graphql`
  query DetailsPageQuery($id: String!, $parentId: String!) {
    contentfulDetailsPage(id: { eq: $id }) {
      longVideo {
        secure_url
      }
      description {
        raw
        references {
          contentful_id
          __typename
          file {
            url
          }
        }
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
      aboutAuthor {
        secure_url
      }
    }
  }
`

const DetailsPage = ({ data, pageContext: { crumbs } }) => {
  const {
    contentfulDetailsPage: { longVideo, description },
    parent,
  } = data
  const richTextRenderOptions = {
    renderNode: {
      [INLINES.ASSET_HYPERLINK]: ({ data }, children) => (
        <a href={data.target.file.url}>{children}</a>
      ),
    },
  }
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
          {description && renderRichText(description, richTextRenderOptions)}
        </div>
      </div>
      <ConceptNav
        baseSlug={parent.slug}
        hasStudentPresentations={!!parent.studentPresentations}
        hasAdditionalBackground={!!parent.additionalBackground}
        aboutAuthorVideoUrl={
          parent.aboutAuthor &&
          parent.aboutAuthor.length > 0 &&
          parent.aboutAuthor[0].secure_url
        }
      />
    </Layout>
  )
}

export default DetailsPage
