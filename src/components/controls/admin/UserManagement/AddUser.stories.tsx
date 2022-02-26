import React from "react"
import AddUserComponent from "./AddUser"

export default {
  title: "Controls/Admin/User Management/Add User",
  component: AddUserComponent,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

export const AddUser = () => <AddUserComponent />
