import * as React from "react"
import Breadcrumbs from "../components/breadcrumbs"
import Layout from "../components/layout"
import RichText from "../components/richText"
import Seo from "../components/seo"

const PureRichTextPage = ({ pageContext: { content, crumbs, title } }) => (
  <Layout>
    <Seo title={title} />
    <Breadcrumbs crumbs={crumbs} />
    <div className="prose mx-auto">
      {content && <RichText content={content} />}
    </div>
  </Layout>
)

export default PureRichTextPage
