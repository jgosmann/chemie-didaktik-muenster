import React from "react"
import { ComponentStory } from "@storybook/react"
import AdminArea, { AdminAreaProps } from "."

export default {
  title: "Admin Area",
  component: AdminArea,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
}

const Template: ComponentStory<typeof AdminArea> = (args: AdminAreaProps) => (
  <AdminArea {...args} />
)

export const Default = Template.bind({})
Default.args = {}
