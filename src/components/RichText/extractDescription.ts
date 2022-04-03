import {
  ContentfulRichTextGatsbyReference,
  RenderRichTextData,
} from "gatsby-source-contentful/rich-text"
import extractText from "./extractText"

export default function extractDescription(
  richtext?: RenderRichTextData<ContentfulRichTextGatsbyReference>,
  maxLength = 1000
): string {
  if (!richtext) {
    return undefined
  }

  const text = extractText(JSON.parse(richtext.raw))
  if (text.length > maxLength) {
    return text.slice(0, maxLength - 1) + "…"
  } else {
    return text
  }
}
