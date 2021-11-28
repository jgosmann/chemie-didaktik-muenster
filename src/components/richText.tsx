import { BLOCKS, INLINES } from "@contentful/rich-text-types"
import { graphql, Link } from "gatsby"
import {
  ContentfulRichTextGatsbyReference,
  renderRichText,
  RenderRichTextData,
} from "gatsby-source-contentful/rich-text"
import * as React from "react"
import { DefaultCryptedPhone } from "./crypted"
import { DefaultCryptedEmail } from "./crypted"

export const query = graphql`
  fragment RichTextFragment on Content {
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
`

const replacePlaceholder = (
  text: any,
  placeholder: string,
  component: React.ReactNode
) => {
  if (typeof text === "string" && text.match(placeholder)) {
    const parts = text.split(placeholder)
    return parts.flatMap((part, index) => {
      if (index > 0) {
        return [component, part]
      }
      return [part]
    })
  }
  return [text]
}

const richTextRenderOptions = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_, children) => {
      const withLineBreaks = children.flatMap(child => {
        if (typeof child === "string") {
          return child.split("\n").flatMap((line, index) => {
            if (index > 0) {
              return [<br />, line]
            }
            return [line]
          })
        }
        return [child]
      })
      const withCustomComponents = withLineBreaks
        .flatMap(child =>
          replacePlaceholder(child, "<!--telefon-->", <DefaultCryptedPhone />)
        )
        .flatMap(child =>
          replacePlaceholder(child, "<!--email-->", <DefaultCryptedEmail />)
        )
      return <p>{withCustomComponents}</p>
    },
    [INLINES.ASSET_HYPERLINK]: ({ data }, children) => {
      return <a href={data.target.file.url}>{children}</a>
    },
    [INLINES.ENTRY_HYPERLINK]: ({ data }, children) => {
      if (data.target.crumbs) {
        return (
          <Link to={data.target.crumbs.map(c => c.slug).join("/")}>
            {children}
          </Link>
        )
      }
      return (
        <span className="bg-red-100 rounded border border-red-700">
          Entry cannot be linked.
        </span>
      )
    },
    [BLOCKS.EMBEDDED_ASSET]: ({ data }) => {
      if (
        data.target.file.url.match(
          /\.(a?png|gif|jfif|jpe?g|pj(pe)?g|svg|webp)$/
        )
      ) {
        return (
          <img
            src={data.target.file.url}
            alt={data.target.title}
            className="max-w-full"
          />
        )
      } else if (
        data.target.file.url.match(/\.(3gp|mov|mp4|mpe?g|og[gv]|webm)$/)
      ) {
        return <video controls src={data.target.file.url} />
      } else {
        return (
          <div className="bg-red-100 rounded p-2 border border-red-700">
            Embedded asset cannot be displayed.
          </div>
        )
      }
    },
  },
}

export interface RichTextProps {
  content: RenderRichTextData<ContentfulRichTextGatsbyReference>
}

const RichText = ({ content }: RichTextProps) => (
  <>{renderRichText(content, richTextRenderOptions)}</>
)

export default RichText
