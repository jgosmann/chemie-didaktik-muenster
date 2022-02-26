import React from "react"
import ChangePassword from "./ChangePassword"
import LogoutButton from "./LogoutButton"
import TrackedDomains from "./TrackedDomains"

export interface AdminAreaProps {
  logout?: () => void
}

const AdminArea = ({ logout }: AdminAreaProps): JSX.Element => (
  <>
    <div className="flex justify-between">
      <h1 className="text-2xl">Administration</h1>
      <LogoutButton logout={logout} />
    </div>
    <div className="flex flex-wrap gap-16">
      <div className="rounded bg-gray-100  shadow p-4">
        <TrackedDomains />
      </div>
      <div className="rounded bg-gray-100  shadow p-4">
        <ChangePassword />
      </div>
    </div>
  </>
)

export default AdminArea
