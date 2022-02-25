import React from "react"
import LogoutButton from "./LogoutButton"

export interface AdminAreaProps {
  logout?: () => void
}

const AdminArea = ({ logout }: AdminAreaProps): JSX.Element => (
  <>
    <div className="flex justify-between">
      <h1 className="text-2xl mb-4">Administration</h1>
      <LogoutButton logout={logout} />
    </div>
  </>
)

export default AdminArea
