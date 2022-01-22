import * as React from "react"
import { Breadcrumb } from "../components/navigation/Breadcrumbs"
import Layout from "../components/layout"
import RichText from "../components/RichText"
import Seo from "../components/seo"
import { RichTextFragment } from "../components/RichText/RichText"

export interface PureRichTextPageProps {
  pageContext: {
    content: RichTextFragment
    collapseHeadings?: boolean
    crumbs: Breadcrumb[]
    title: string
  }
}

const PureRichTextPage = ({
  pageContext: { content, collapseHeadings, crumbs, title },
}: PureRichTextPageProps) => (
  <Layout crumbs={crumbs}>
    <Seo title={title} />
    <div className="prose mx-auto">
      {content && (
        <RichText content={content} collapseHeadings={collapseHeadings} />
      )}
    </div>
  </Layout>
)

export default PureRichTextPage
