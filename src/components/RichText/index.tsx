import { graphql } from "gatsby"
import { transformToToc } from "./toc"
import RichText from "./RichText"

export const query = graphql`
  fragment RichTextFragment on Content {
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
`

export default RichText
export { transformToToc }
