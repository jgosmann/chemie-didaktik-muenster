import { graphql } from "gatsby"
import * as React from "react"
import { Breadcrumb } from "../components/navigation/Breadcrumbs"
import { RichTextFragment } from "../components/RichText"
import PureRichTextPage, { PureRichTextPageProps } from "./pureRichTextPage"

interface BasicPageQuery {
  contentfulBasicPage: {
    title: string
    crumbs: Breadcrumb[]
    content: RichTextFragment
  }
}

export const query = graphql`
  query BasicPageQuery($id: String!) {
    contentfulBasicPage(id: { eq: $id }) {
      title
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

export interface DetailsPageProps {
  data: BasicPageQuery
  pageContext: Omit<
    PureRichTextPageProps["pageContext"],
    "content" | "crumbs" | "title"
  >
}

const DetailsPage = ({ data, pageContext }: DetailsPageProps) => {
  const { content, crumbs, title } = data.contentfulBasicPage
  return (
    <PureRichTextPage
      pageContext={{ ...pageContext, content, crumbs, title }}
    />
  )
}

export default DetailsPage
