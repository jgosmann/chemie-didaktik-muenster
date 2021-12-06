import React from "react"
import { ComponentStory } from "@storybook/react"
import CollapsibleComponent, { CollapsibleProps } from "."

export default {
  title: "Controls/Collapsible",
  component: CollapsibleComponent,
}

const Template: ComponentStory<typeof CollapsibleComponent> = ({
  children,
  ...args
}: CollapsibleProps) => (
  <CollapsibleComponent {...args}>{children}</CollapsibleComponent>
)

export const Collapsible = Template.bind({})
Collapsible.args = {
  children: "Description",
  label: "Label",
}
