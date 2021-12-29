import React from "react"
import { render } from "@testing-library/react"
import { transformToToc } from "./toc"
import { richTextMultipleHeadings } from "../../test-fixtures/richText"
import RichText from "./RichText"

describe("transformToToc", () => {
  it("extracts the table of contents hierarchy", () => {
    const toc = transformToToc(richTextMultipleHeadings)
    expect(toc).toMatchObject([
      {
        title: "heading 1a",
        level: 1,
        children: [
          {
            title: "heading 2a",
            level: 2,
            children: [
              {
                title: "heading 3a",
                level: 3,
                children: [
                  {
                    title: "heading 4a",
                    level: 4,
                    children: [
                      {
                        title: "heading 5a",
                        level: 5,
                        children: [
                          { title: "heading 6a", level: 6, children: [] },
                          { title: "heading 6b", level: 6, children: [] },
                        ],
                      },
                      { title: "heading 5b", level: 5, children: [] },
                    ],
                  },
                  { title: "heading 4b", level: 4, children: [] },
                ],
              },
              { title: "heading 3b", level: 3, children: [] },
            ],
          },
          { title: "heading 2b", level: 2, children: [] },
        ],
      },
      { title: "heading 1b", level: 1, children: [] },
    ])
  })

  it("extracts IDs suitable for linking to the sections", () => {
    const content = {
      raw:
        '{"nodeType":"document","data":{},"content":[' +
        '{"nodeType":"paragraph","data":{},"content":[' +
        '{"nodeType":"text","value":"normal text ","marks":[],"data":{}}]},' +
        '{"nodeType":"heading-1","data":{},"content":[' +
        '{"nodeType":"text","value":"heading 1a","marks":[],"data":{}}]},' +
        '{"nodeType":"paragraph","data":{},"content":[' +
        '{"nodeType":"text","value":"heading 1a text","marks":[],"data":{}}]},' +
        '{"nodeType":"heading-2","data":{},"content":[' +
        '{"nodeType":"text","value":"heading 2","marks":[],"data":{}}]},' +
        '{"nodeType":"paragraph","data":{},"content":[' +
        '{"nodeType":"text","value":"heading 1.2a text ","marks":[],"data":{}}]},' +
        '{"nodeType":"heading-1","data":{},"content":[' +
        '{"nodeType":"text","value":"heading 1b","marks":[],"data":{}}]},' +
        '{"nodeType":"paragraph","data":{},"content":[' +
        '{"nodeType":"text","value":"heading 1b text","marks":[],"data":{}}]},' +
        '{"nodeType":"heading-2","data":{},"content":[' +
        '{"nodeType":"text","value":"heading 2","marks":[],"data":{}}]},' +
        '{"nodeType":"paragraph","data":{},"content":[' +
        '{"nodeType":"text","value":"heading 1.2b text ","marks":[],"data":{}}]}]}',
      references: [],
    }
    const toc = transformToToc(content)
    const heading12bId = toc[1].children[0].id

    const { container } = render(<RichText content={content} />)
    const heading12bSibling = container.querySelector(`#${heading12bId}`)
      .nextElementSibling

    expect(heading12bSibling).toHaveTextContent("heading 1.2b text")
  })
})
