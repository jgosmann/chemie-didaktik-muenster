import React from "react"
import { userEvent, within } from "@storybook/testing-library"
import { allContentfulStartseite } from "../../../test-fixtures/content"
import { SideNavView } from "."
import { richTextMultipleHeadings } from "../../../test-fixtures/richText"

export default {
  title: "Layout/Side Navigation",
  component: SideNavView,
  parameters: {
    layout: "fullscreen",
  },
}

const queryData = {
  allContentfulStartseite: allContentfulStartseite(),
  faq: {
    content: richTextMultipleHeadings,
  },
}

const Template = () => (
  <SideNavView isOpen onClose={() => undefined} query={queryData} />
)

export const SideNavigation = Template.bind({})
SideNavigation.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  for (const button of canvas.queryAllByRole("button")) {
    await userEvent.click(button)
  }
}
