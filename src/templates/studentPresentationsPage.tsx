import {
  ContentfulRichTextGatsbyReference,
  RenderRichTextData,
} from "gatsby-source-contentful/rich-text"
import { graphql } from "gatsby"
import * as React from "react"
import PureRichTextPage, { PureRichTextPageContext } from "./pureRichTextPage"

export const query = graphql`
  query StudentPresentationsPageQuery($id: String!) {
    contentfulConceptPage(id: { eq: $id }) {
      studentPresentations {
        ...RichTextFragment
      }
    }
  }
`

export interface StudentPresentationsPageProps {
  data: {
    contentfulConceptPage: {
      studentPresentations: RenderRichTextData<ContentfulRichTextGatsbyReference>
    }
  }
  pageContext: Omit<PureRichTextPageContext, "content">
}

const StudentPresentationsPage = ({
  data,
  pageContext,
}: StudentPresentationsPageProps) => {
  const {
    contentfulConceptPage: { studentPresentations },
  } = data
  return (
    <PureRichTextPage
      pageContext={{
        content: studentPresentations,
        ...pageContext,
      }}
    />
  )
}

export default StudentPresentationsPage
