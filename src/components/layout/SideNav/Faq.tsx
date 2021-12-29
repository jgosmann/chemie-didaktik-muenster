import { graphql, Link } from "gatsby"
import React from "react"
import Collapsible from "../../controls/Collapsible"
import { TocNode, transformToToc } from "../../RichText/toc"

export const query = graphql`
  fragment FaqFragment on Query {
    faq: contentfulBasicPage(slug: { eq: "faq" }) {
      content {
        raw
      }
    }
  }
`

export interface FaqProps {
  faq: {
    content: {
      raw: string
    }
  }
}

const FaqTocNode = ({ tocChildren }: { tocChildren: TocNode[] }) => (
  <ol className="pl-4 divide-y divide-gray-400">
    {tocChildren.map(child => (
      <li key={child.id} className="py-1">
        <Link to={`/faq#${child.id}`}>{child.title}</Link>
        {child.children && <FaqTocNode tocChildren={child.children} />}
      </li>
    ))}
  </ol>
)

const Faq = ({ faq }: FaqProps) => {
  const toc = transformToToc(faq.content)

  return (
    <ol className="pl-4 divide-y divide-gray-400">
      {toc.map(heading => (
        <li key={heading.id} className="py-1">
          {heading.children.length > 0 ? (
            <Collapsible
              label={
                <Link to={`/faq#section-${heading.id}`}>{heading.title}</Link>
              }
            >
              <FaqTocNode tocChildren={heading.children} />
            </Collapsible>
          ) : (
            <Link to={`/faq#section-${heading.id}`}>{heading.title}</Link>
          )}
        </li>
      ))}
    </ol>
  )
}

export default Faq
