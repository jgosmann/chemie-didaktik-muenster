import React, { useState } from "react"
import { ComponentStory } from "@storybook/react"
import { userEvent, within } from "@storybook/testing-library"
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

const NestedTemplate: ComponentStory<typeof CollapsibleViewComponent> = ({
  children,
  ...args
}: CollapsibleViewProps) => {
  const [enlarged, setEnlarged] = useState(false)
  return (
    <CollapsibleViewComponent {...args}>
      <button
        style={{
          height: enlarged ? 300 : 50,
          backgroundColor: "#ccc",
          display: "block",
        }}
        onClick={() => setEnlarged(previous => !previous)}
      >
        {enlarged ? "Shrink" : "Enlarge"}
      </button>
      {children}
    </CollapsibleViewComponent>
  )
}

export const Nested = NestedTemplate.bind({})
Nested.args = {
  ...Expanded.args,
}
Nested.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await userEvent.click(canvas.getByText("Enlarge"))
}
