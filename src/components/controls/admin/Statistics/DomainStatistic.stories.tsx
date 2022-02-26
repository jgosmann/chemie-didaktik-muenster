import React from "react"
import { ComponentStory } from "@storybook/react"
import { userEvent, within } from "@storybook/testing-library"
import DomainStatisticComponent, {
  DomainStatisticProps,
} from "./DomainStatistics"

export default {
  title: "Controls/Admin/Statistics/Domain Statistic",
  component: DomainStatisticComponent,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

const Template: ComponentStory<typeof DomainStatisticComponent> = (
  args: DomainStatisticProps
) => <DomainStatisticComponent {...args} />

const pathStatistics = [
  {
    name: "path",
    count: 12,
    nestedCount: 4,
    nested: [{ name: "leaf", count: 4, nestedCount: 0 }],
  },
  { name: "another-path", count: 7, nestedCount: 0 },
]

export const DomainStatistic = Template.bind({})
DomainStatistic.args = {
  node: {
    domain: "www.example.org",
    count: 42,
    nestedCount: 23,
    nested: pathStatistics,
  },
}
DomainStatistic.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await Promise.all(
    canvas.getAllByTitle("Ausklappen").map(btn => userEvent.click(btn))
  )
}
