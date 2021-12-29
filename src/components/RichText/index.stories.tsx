import React from "react"
import { richTextContainingAllElements } from "../../test-fixtures/richText"

import RichTextComponent from "."

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
  <RichTextComponent content={richTextContainingAllElements} />
)
