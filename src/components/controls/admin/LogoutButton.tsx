import React from "react"

export interface LogoutButtonProps {
  logout?: () => void
}

const LogoutButton = ({ logout }: LogoutButtonProps) => {
  return (
    <button className="logout btn primary" onClick={logout}>
      Ausloggen
    </button>
  )
}

export default LogoutButton
