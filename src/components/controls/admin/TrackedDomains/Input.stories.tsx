import { ComponentStory } from "@storybook/react"
import React from "react"
import Input, { InputProps } from "./Input"

export default {
  title: "Controls/Admin/Tracked Domains/Input",
  component: Input,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

const Template: ComponentStory<typeof Input> = (args: InputProps) => (
  <Input {...args} />
)

export const Empty = Template.bind({})
Empty.args = {
  trackedDomains: [],
}

export const Filled = Template.bind({})
Filled.args = {
  trackedDomains: ["foo.com", "sub.example.org"],
}
