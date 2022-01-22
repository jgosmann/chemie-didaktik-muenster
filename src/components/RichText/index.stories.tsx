import React from "react"
import {
  richTextContainingAllElements,
  richTextMultipleHeadings,
} from "../../test-fixtures/richText"

import RichTextComponent from "."
import { userEvent, within } from "@storybook/testing-library"

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

export const Default = () => (
  <RichTextComponent content={richTextContainingAllElements} />
)

export const Collapsible = () => (
  <RichTextComponent content={richTextMultipleHeadings} collapseHeadings />
)
Collapsible.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await userEvent.click(canvas.getAllByRole("button")[0])
}
