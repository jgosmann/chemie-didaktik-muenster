import React from "react"
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
    <TrackedDomains />
  </>
)

export default AdminArea
