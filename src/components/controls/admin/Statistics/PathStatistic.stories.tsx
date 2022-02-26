import React from "react"
import { ComponentStory } from "@storybook/react"
import PathStatistic, { PathStatisticProps } from "./PathStatistic"
import { userEvent, within } from "@storybook/testing-library"

export default {
  title: "Controls/Admin/Statistics/Path Statistic",
  component: PathStatistic,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

const Template: ComponentStory<typeof PathStatistic> = (
  args: PathStatisticProps
) => <PathStatistic {...args} />

export const Leaf = Template.bind({})
Leaf.args = {
  prefix: "/path/to/",
  node: { name: "leaf", count: 42, nestedCount: 0 },
}

export const Tree = Template.bind({})
Tree.args = {
  prefix: "/",
  node: {
    name: "leaf",
    count: 42,
    nestedCount: 23,
    nested: [
      {
        name: "path",
        count: 12,
        nestedCount: 4,
        nested: [{ name: "leaf", count: 4, nestedCount: 0 }],
      },
      { name: "another-path", count: 7, nestedCount: 0 },
    ],
  },
}
Tree.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await Promise.all(
    canvas.getAllByTitle("Ausklappen").map(btn => userEvent.click(btn))
  )
}
