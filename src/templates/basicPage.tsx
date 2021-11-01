import { graphql } from "gatsby"
import * as React from "react"
import PureRichTextPage from "./pureRichTextPage"

export const query = graphql`
  query BasicPageQuery($id: String!) {
    contentfulBasicPage(id: { eq: $id }) {
      content {
        raw
      }
    }
  }
`

const DetailsPage = ({ data, pageContext }) => {
  const { content } = data.contentfulBasicPage
  return <PureRichTextPage pageContext={{ ...pageContext, content }} />
}

export default DetailsPage
