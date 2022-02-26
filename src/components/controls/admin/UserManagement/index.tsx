import React, { useCallback, useContext } from "react"
import AnalyticsClientContext from "../AnalyticsClient"
import DataLoader from "../DataLoader"
import UserList from "./UserList"

export interface UserManagementProps {
  loggedInUser: string
}

const UserManagement = ({ loggedInUser }: UserManagementProps) => {
  const analyticsClient = useContext(AnalyticsClientContext)
  const load = useCallback(() => analyticsClient.default.getUsersUsersGet(), [
    analyticsClient,
  ])
  return (
    <DataLoader
      load={load}
      render={data => (
        <UserList loggedInUser={loggedInUser} initialUsers={data.users} />
      )}
    />
  )
}

export default UserManagement
