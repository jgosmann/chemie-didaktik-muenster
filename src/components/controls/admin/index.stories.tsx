import React from "react"
import { ComponentStory } from "@storybook/react"
import AdminAreaComponent, { AdminAreaProps } from "."

export default {
  title: "Admin Area",
  component: AdminAreaComponent,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
}

const Template: ComponentStory<typeof AdminAreaComponent> = (
  args: AdminAreaProps
) => <AdminAreaComponent {...args} />

export const AdminArea = Template.bind({})
AdminArea.args = {
  loggedInUser: "john",
}
