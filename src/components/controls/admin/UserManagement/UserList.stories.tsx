import React from "react"
import { ComponentStory } from "@storybook/react"
import UserListComponent, { UserListProps } from "./UserList"

export default {
  title: "Controls/Admin/User Management/User List",
  component: UserListComponent,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

const Template: ComponentStory<typeof UserListComponent> = (
  args: UserListProps
) => <UserListComponent {...args} />

export const UserList = Template.bind({})
UserList.args = {
  initialUsers: [
    {
      username: "john",
      realname: "John Wick",
    },
    {
      username: "jane",
      comment: "Logged in user. Some lengthy comment describing the user.",
    },
  ],
  loggedInUser: "jane",
}

export const SingleUserRemainingDisallowsDeletion = Template.bind({})
SingleUserRemainingDisallowsDeletion.args = {
  initialUsers: [
    {
      username: "john",
      realname: "John Wick",
    },
  ],
  loggedInUser: "foo",
}
