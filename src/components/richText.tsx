import { BLOCKS, INLINES } from "@contentful/rich-text-types"
import { graphql, Link } from "gatsby"
import {
  ContentfulRichTextGatsbyReference,
  renderRichText,
  RenderRichTextData,
} from "gatsby-source-contentful/rich-text"
import * as React from "react"

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

const richTextRenderOptions = {
  renderNode: {
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
