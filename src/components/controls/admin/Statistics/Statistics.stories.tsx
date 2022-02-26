import React from "react"
import { ComponentStory } from "@storybook/react"
import StatisticsComponent, { StatisticsProps } from "./Statistics"

export default {
  title: "Controls/Admin/Statistics/Statistics",
  component: StatisticsComponent,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

const Template: ComponentStory<typeof StatisticsComponent> = (
  args: StatisticsProps
) => <StatisticsComponent {...args} />

const pathStatistics = [
  {
    name: "path",
    count: 12,
    nestedCount: 4,
    nested: [{ name: "leaf", count: 4, nestedCount: 0 }],
  },
  { name: "another-path", count: 7, nestedCount: 0 },
]

export const Statistics = Template.bind({})
Statistics.args = {
  data: [
    {
      domain: "Alle Domains",
      count: 42,
      nestedCount: 23,
      nested: pathStatistics,
    },
    {
      domain: "www.example.org",
      count: 42,
      nestedCount: 23,
      nested: pathStatistics,
    },
  ],
}
