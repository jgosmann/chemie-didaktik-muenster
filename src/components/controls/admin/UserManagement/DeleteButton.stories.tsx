import React from "react"
import { ComponentStory } from "@storybook/react"
import DeleteButtonComponent, { DeleteButtonProps } from "./DeleteButton"

export default {
  title: "Controls/Admin/User Management/Delete Button",
  component: DeleteButtonComponent,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

const Template: ComponentStory<typeof DeleteButtonComponent> = (
  args: DeleteButtonProps
) => <DeleteButtonComponent {...args} />

export const DeleteButton = Template.bind({})
