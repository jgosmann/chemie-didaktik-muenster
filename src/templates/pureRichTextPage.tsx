import * as React from "react"
import { Breadcrumb } from "../components/navigation/Breadcrumbs"
import Layout from "../components/layout"
import RichText from "../components/RichText"
import Seo from "../components/seo"
import { RichTextFragment } from "../components/RichText/RichText"
import extractDescription from "../components/RichText/extractDescription"

export interface PureRichTextPageContext {
  content: RichTextFragment
  collapseHeadings?: boolean
  crumbs: Breadcrumb[]
  title: string
}
export interface PureRichTextPageProps {
  pageContext: PureRichTextPageContext
}

const PureRichTextPage = ({
  pageContext: { content, collapseHeadings, crumbs, title },
}: PureRichTextPageProps) => (
  <Layout crumbs={crumbs}>
    <Seo title={title} description={extractDescription(content)} />
    <div className="prose mx-auto">
      {content && (
        <RichText content={content} collapseHeadings={collapseHeadings} />
      )}
    </div>
  </Layout>
)

export default PureRichTextPage
