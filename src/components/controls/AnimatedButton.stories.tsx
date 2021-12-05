import React from "react"
import { ComponentStory } from "@storybook/react"

import AnimatedButtonComponent from "./AnimatedButton"

export default {
  title: "Controls/Animated Button",
  component: AnimatedButtonComponent,
}

const Template: ComponentStory<typeof AnimatedButtonComponent> = (args: {
  title?: string
  className?: string
}) => (
  <AnimatedButtonComponent {...args}>
    <div className="p-2">Label</div>
  </AnimatedButtonComponent>
)

export const AnimatedButton = Template.bind({})
AnimatedButton.args = {
  title: "Click me!",
  className: "rounded border shadow",
}
