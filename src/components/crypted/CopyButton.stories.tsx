import React from "react"
import { ComponentStory } from "@storybook/react"

import CopyButton from "./CopyButton"

export default {
  title: "Crypted/Copy Button",
  component: CopyButton,
}

const Template: ComponentStory<typeof CopyButton> = (args: {
  title?: string
}) => <CopyButton getCopyText={() => ""} {...args} />

export const WithoutTitle = Template.bind({})
WithoutTitle.args = { title: undefined }

export const WithTitle = Template.bind({})
WithTitle.args = {
  title: "Title",
}
