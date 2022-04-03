import {
  ContentfulRichTextGatsbyReference,
  RenderRichTextData,
} from "gatsby-source-contentful/rich-text"
import { richTextContainingAllElements } from "../../test-fixtures/richText"
import extractDescription from "./extractDescription"

describe("extractDescription", () => {
  it("extracts the text from a RichText tree", () => {
    expect(extractDescription(richTextContainingAllElements)).toEqual(
      "normal text bold italics underline code heading 1 heading 2 " +
        "heading 3 heading 4 heading 5 heading 6 blockquote list 1 " +
        "list 2 ordered list 1 ordered list 2 Url link Entry link " +
        "Asset link"
    )
  })

  it("it shortens long texts", () => {
    const document = JSON.parse(richTextContainingAllElements.raw)
    document.content = [...document.content, ...document.content]
    const richtext: RenderRichTextData<ContentfulRichTextGatsbyReference> = {
      raw: JSON.stringify(document),
      references: richTextContainingAllElements.references,
    }
    expect(extractDescription(richtext, 256)).toEqual(
      "normal text bold italics underline code heading 1 heading 2 " +
        "heading 3 heading 4 heading 5 heading 6 blockquote list 1 " +
        "list 2 ordered list 1 ordered list 2 Url link Entry link " +
        "Asset link normal text bold italics underline code heading 1 " +
        "heading 2 heading 3…"
    )
  })
})
