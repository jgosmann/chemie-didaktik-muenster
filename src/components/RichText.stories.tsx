import React from "react"

import RichTextComponent from "./RichText"

export default {
  title: "Rich Text",
  component: RichTextComponent,
  decorators: [
    Story => (
      <div className="prose">
        <Story />
      </div>
    ),
  ],
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

export const RichText = () => (
  <RichTextComponent
    content={{
      raw:
        '{"nodeType":"document","data":{},"content":[' +
        '{"nodeType":"paragraph","data":{},"content":[' +
        '{"nodeType":"text","value":"normal text ","marks":[],"data":{}},' +
        '{"nodeType":"text","value":"bold","marks":[{"type":"bold"}],"data":{}},' +
        '{"nodeType":"text","value":" ","marks":[],"data":{}},' +
        '{"nodeType":"text","value":"italics","marks":[{"type":"italic"}],"data":{}},' +
        '{"nodeType":"text","value":" ","marks":[],"data":{}},' +
        '{"nodeType":"text","value":"underline","marks":[{"type":"underline"}],"data":{}},' +
        '{"nodeType":"text","value":" ","marks":[],"data":{}},' +
        '{"nodeType":"text","value":"code","marks":[{"type":"code"}],"data":{}}]},' +
        '{"nodeType":"heading-1","data":{},"content":[' +
        '{"nodeType":"text","value":"heading 1","marks":[],"data":{}}]},' +
        '{"nodeType":"heading-2","data":{},"content":[' +
        '{"nodeType":"text","value":"heading 2","marks":[],"data":{}}]},' +
        '{"nodeType":"heading-3","data":{},"content":[' +
        '{"nodeType":"text","value":"heading 3","marks":[],"data":{}}]},' +
        '{"nodeType":"heading-4","data":{},"content":[' +
        '{"nodeType":"text","value":"heading 4","marks":[],"data":{}}]},' +
        '{"nodeType":"heading-5","data":{},"content":[' +
        '{"nodeType":"text","value":"heading 5","marks":[],"data":{}}]},' +
        '{"nodeType":"heading-6","data":{},"content":[' +
        '{"nodeType":"text","value":"heading 6","marks":[],"data":{}}]},' +
        '{"nodeType":"blockquote","data":{},"content":[' +
        '{"nodeType":"paragraph","data":{},"content":[' +
        '{"nodeType":"text","value":"blockquote","marks":[],"data":{}}]}]},' +
        '{"nodeType":"unordered-list","data":{},"content":[' +
        '{"nodeType":"list-item","data":{},"content":[' +
        '{"nodeType":"paragraph","data":{},"content":[' +
        '{"nodeType":"text","value":"list 1","marks":[],"data":{}}]}]},' +
        '{"nodeType":"list-item","data":{},"content":[' +
        '{"nodeType":"paragraph","data":{},"content":[' +
        '{"nodeType":"text","value":"list 2","marks":[],"data":{}}]}]}]},' +
        '{"nodeType":"ordered-list","data":{},"content":[' +
        '{"nodeType":"list-item","data":{},"content":[' +
        '{"nodeType":"paragraph","data":{},"content":[' +
        '{"nodeType":"text","value":"ordered list 1","marks":[],"data":{}}]}]},' +
        '{"nodeType":"list-item","data":{},"content":[' +
        '{"nodeType":"paragraph","data":{},"content":[' +
        '{"nodeType":"text","value":"ordered list 2","marks":[],"data":{}}]}]}]},' +
        '{"nodeType":"hr","data":{},"content":[]},' +
        '{"nodeType":"unordered-list","data":{},"content":[' +
        '{"nodeType":"list-item","data":{},"content":[' +
        '{"nodeType":"paragraph","data":{},"content":[' +
        '{"nodeType":"text","value":"","marks":[],"data":{}},' +
        '{"nodeType":"hyperlink","data":{"uri":"https://google.com"},"content":[' +
        '{"nodeType":"text","value":"Url link","marks":[],"data":{}}]},' +
        '{"nodeType":"text","value":"","marks":[],"data":{}}]}]},' +
        '{"nodeType":"list-item","data":{},"content":[' +
        '{"nodeType":"paragraph","data":{},"content":[' +
        '{"nodeType":"text","value":"","marks":[],"data":{}},' +
        '{"nodeType":"entry-hyperlink","data":{"target":{"sys":{"id":"7c7fnvcBZUOHhsyEVvtyZl","type":"Link","linkType":"Entry"}}},"content":[' +
        '{"nodeType":"text","value":"Entry link","marks":[],"data":{}}]},' +
        '{"nodeType":"text","value":"","marks":[],"data":{}}]}]},' +
        '{"nodeType":"list-item","data":{},"content":[' +
        '{"nodeType":"paragraph","data":{},"content":[' +
        '{"nodeType":"text","value":"","marks":[],"data":{}},' +
        '{"nodeType":"asset-hyperlink","data":{"target":{"sys":{"id":"53ASyrxdvGuE36mJTL1xw6","type":"Link","linkType":"Asset"}}},"content":[' +
        '{"nodeType":"text","value":"Asset link","marks":[],"data":{}}]},' +
        '{"nodeType":"text","value":"","marks":[],"data":{}}]}]}]},' +
        '{"nodeType":"hr","data":{},"content":[]},' +
        '{"nodeType":"embedded-asset-block","data":{"target":{"sys":{"id":"4vlSEhBk6rW9AGVCIr4220","type":"Link","linkType":"Asset"}}},"content":[]},' +
        '{"nodeType":"paragraph","data":{},"content":[' +
        '{"nodeType":"text","value":"","marks":[],"data":{}}]}]}',
      references: [
        {
          __typename: "ContentfulBasicPage",
          contentful_id: "7c7fnvcBZUOHhsyEVvtyZl",
        },
        {
          __typename: "ContentfulAsset",
          contentful_id: "53ASyrxdvGuE36mJTL1xw6",
          file: {
            url:
              "//images.ctfassets.net/if5ucaiwm6fb/53ASyrxdvGuE36mJTL1xw6/653fdbd8a210744039330d9a75f7a0ff/IMG_20211009_153005.jpeg",
          },
          title: "Placeholder 1",
        },
        {
          __typename: "ContentfulAsset",
          contentful_id: "4vlSEhBk6rW9AGVCIr4220",
          file: {
            url:
              "//images.ctfassets.net/if5ucaiwm6fb/4vlSEhBk6rW9AGVCIr4220/cd037134be678533f5ef7d3d464a672c/IMG_20211003_105431.jpeg",
          },
          title: "Placeholder 2",
        },
      ],
    }}
  />
)
