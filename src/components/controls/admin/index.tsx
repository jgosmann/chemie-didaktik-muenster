import React from "react"
import ChangePassword from "./ChangePassword"
import LogoutButton from "./LogoutButton"
import TrackedDomains from "./TrackedDomains"
import UserManagement from "./UserManagement"

export interface AdminAreaProps {
  loggedInUser: string
  logout?: () => void
}

const AdminArea = ({ loggedInUser, logout }: AdminAreaProps): JSX.Element => (
  <>
    <div className="flex justify-between mb-4">
      <h1 className="text-2xl">Administration</h1>
      <LogoutButton logout={logout} />
    </div>
    <div className="flex flex-wrap gap-16">
      <div className="rounded bg-gray-100 shadow p-4">
        <TrackedDomains />
      </div>
      <div className="rounded bg-gray-100 shadow p-4">
        <ChangePassword />
      </div>
      <div className="rounded bg-gray-100 shadow p-4">
        <UserManagement loggedInUser={loggedInUser} />
      </div>
    </div>
  </>
)

export default AdminArea
