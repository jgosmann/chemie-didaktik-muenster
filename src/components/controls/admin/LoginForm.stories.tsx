import { ComponentStory } from "@storybook/react"
import React from "react"
import { Type } from "../../Message"
import LoginForm, { LoginFormProps } from "./LoginForm"

export default {
  title: "Controls/Admin/Login Form",
  component: LoginForm,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

const Template: ComponentStory<typeof LoginForm> = (args: LoginFormProps) => (
  <LoginForm {...args} />
)

export const Active = Template.bind({})
Active.args = {
  isProcessing: false,
}

export const Processing = Template.bind({})
Processing.args = {
  isProcessing: true,
}

export const WithMessage = Template.bind({})
WithMessage.args = {
  message: {
    type: Type.Warning,
    text: "Some message.",
  },
}
