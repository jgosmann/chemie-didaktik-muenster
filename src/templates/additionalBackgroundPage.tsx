import {
  ContentfulRichTextGatsbyReference,
  RenderRichTextData,
} from "gatsby-source-contentful/rich-text"
import { graphql } from "gatsby"
import * as React from "react"
import PureRichTextPage, { PureRichTextPageContext } from "./pureRichTextPage"

export const query = graphql`
  query AdditionalBackgroundPageQuery($id: String!) {
    contentfulConceptPage(id: { eq: $id }) {
      additionalBackground {
        ...RichTextFragment
      }
    }
  }
`

export interface AdditionalBackgroundPageProps {
  data: {
    contentfulConceptPage: {
      additionalBackground: RenderRichTextData<ContentfulRichTextGatsbyReference>
    }
  }
  pageContext: Omit<PureRichTextPageContext, "content">
}

const AdditionalBackgroundPage = ({
  data,
  pageContext,
}: AdditionalBackgroundPageProps) => {
  const {
    contentfulConceptPage: { additionalBackground },
  } = data
  return (
    <PureRichTextPage
      pageContext={{
        content: additionalBackground,
        ...pageContext,
      }}
    />
  )
}

export default AdditionalBackgroundPage
