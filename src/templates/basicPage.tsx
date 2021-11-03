import { graphql } from "gatsby"
import * as React from "react"
import PureRichTextPage from "./pureRichTextPage"

export const query = graphql`
  query BasicPageQuery($id: String!) {
    contentfulBasicPage(id: { eq: $id }) {
      crumbs {
        title
        slug
      }
      content {
        raw
        references: typesafeReferences {
          __typename
          ... on ContentfulReference {
            contentful_id
          }
          ... on ContentfulAsset {
            title
            file {
              url
            }
          }
          ... on Linkable {
            crumbs {
              slug
            }
          }
        }
      }
    }
  }
`

const DetailsPage = ({ data, pageContext }) => {
  const { content, crumbs } = data.contentfulBasicPage
  return <PureRichTextPage pageContext={{ ...pageContext, content, crumbs }} />
}

export default DetailsPage
