import React from "react"
import { ComponentStory } from "@storybook/react"
import TreeIcon, { TreeIconProps } from "./TreeIcon"

export default {
  title: "Controls/Admin/Statistics/Tree Icon",
  component: TreeIcon,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

const Template: ComponentStory<typeof TreeIcon> = (args: TreeIconProps) => (
  <TreeIcon {...args} />
)

export const NonLastNonInnermost = Template.bind({})
NonLastNonInnermost.args = {
  isLast: false,
  isInnermost: false,
}

export const LastNonInnermost = Template.bind({})
LastNonInnermost.args = {
  isLast: true,
  isInnermost: false,
}

export const NonLastInnermost = Template.bind({})
NonLastInnermost.args = {
  isLast: false,
  isInnermost: true,
}

export const LastInnermost = Template.bind({})
LastInnermost.args = {
  isLast: true,
  isInnermost: true,
}
