import React from "react"
import Message, { MessageProps, Type } from "./Message"
import { ComponentStory } from "@storybook/react"

export default {
  title: "Controls/Message",
  component: Message,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

const Template: ComponentStory<typeof Message> = (args: MessageProps) => (
  <Message {...args} />
)

export const Success = Template.bind({})
Success.args = {
  type: Type.Success,
  children: "Success message",
}

export const Info = Template.bind({})
Info.args = {
  type: Type.Info,
  children: "Info message",
}

export const Warning = Template.bind({})
Warning.args = {
  type: Type.Warning,
  children: "Warning message",
}

export const Error = Template.bind({})
Error.args = {
  type: Type.Error,
  children: "Error message",
}
