import { graphql } from "gatsby"
import { renderRichText } from "gatsby-source-contentful/rich-text"
import * as React from "react"
import Breadcrumbs from "../components/breadcrumbs"
import Layout from "../components/layout"
import Seo from "../components/seo"

export const query = graphql`
  query BasicPageQuery($id: String!) {
    contentfulBasicPage(id: { eq: $id }) {
      content {
        raw
      }
    }
  }
`

const DetailsPage = ({ data, pageContext: { crumbs } }) => {
  const { content } = data.contentfulBasicPage
  return (
    <Layout>
      <Seo title="Page two" />
      <Breadcrumbs crumbs={crumbs} />
      <div className="prose mx-auto">{content && renderRichText(content)}</div>
    </Layout>
  )
}

export default DetailsPage
