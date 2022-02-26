import React from "react"
import ChangePasswordComponent from "./ChangePassword"

export default {
  title: "Controls/Admin/Change Password",
  component: ChangePasswordComponent,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

export const ChangePassword = () => <ChangePasswordComponent />
