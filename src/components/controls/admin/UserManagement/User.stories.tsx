import React from "react"
import { ComponentStory } from "@storybook/react"
import UserComponent, { UserProps } from "./User"

export default {
  title: "Controls/Admin/User Management/User",
  component: UserComponent,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

const Template: ComponentStory<typeof UserComponent> = (args: UserProps) => (
  <UserComponent {...args} />
)

export const SimpleUser = Template.bind({})
SimpleUser.args = {
  username: "john",
  realname: "",
  comment: "",
}

export const DeletionDisabled = Template.bind({})
DeletionDisabled.args = {
  username: "john",
  disableDeletion: true,
}

export const UserWithRealname = Template.bind({})
UserWithRealname.args = {
  username: "john",
  realname: "John W. Doe",
}

export const UserWithComment = Template.bind({})
UserWithComment.args = {
  username: "john",
  comment: "This is a comment describing the user in great detail.",
}
