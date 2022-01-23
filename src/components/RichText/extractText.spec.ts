import { richTextContainingAllElements } from "../../test-fixtures/richText"
import extractText from "./extractText"

describe("extractText", () => {
  it("extracts the text from a RichText tree", () => {
    expect(extractText(JSON.parse(richTextContainingAllElements.raw))).toEqual(
      "normal text bold italics underline code heading 1 heading 2 " +
        "heading 3 heading 4 heading 5 heading 6 blockquote list 1 " +
        "list 2 ordered list 1 ordered list 2 Url link Entry link " +
        "Asset link"
    )
  })
})
