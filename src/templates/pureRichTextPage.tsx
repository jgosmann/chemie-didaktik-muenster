import * as React from "react"
import { Breadcrumb } from "../components/breadcrumbs"
import Layout from "../components/layout"
import RichText, { RichTextFragment } from "../components/richText"
import Seo from "../components/seo"

export interface PureRichTextPageProps {
  pageContext: {
    content: RichTextFragment
    crumbs: Breadcrumb[]
    title: string
  }
}

const PureRichTextPage = ({
  pageContext: { content, crumbs, title },
}: PureRichTextPageProps) => (
  <Layout crumbs={crumbs}>
    <Seo title={title} />
    <div className="prose mx-auto">
      {content && <RichText content={content} />}
    </div>
  </Layout>
)

export default PureRichTextPage
