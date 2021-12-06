import React from "react"
import { ComponentStory } from "@storybook/react"
import CollapsibleViewComponent, {
  CollapsibleViewProps,
} from "./CollapsibleView"

export default {
  title: "Controls/Collapsible/View",
  component: CollapsibleViewComponent,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

const Template: ComponentStory<typeof CollapsibleViewComponent> = ({
  children,
  ...args
}: CollapsibleViewProps) => (
  <CollapsibleViewComponent {...args}>{children}</CollapsibleViewComponent>
)

export const Expanded = Template.bind({})
Expanded.args = {
  children: "Description",
  label: "Label",
  isExpanded: true,
}

export const Collapsed = Template.bind({})
Collapsed.args = {
  ...Expanded.args,
  isExpanded: false,
}
