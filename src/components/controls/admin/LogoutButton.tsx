import React from "react"

export interface LogoutButtonProps {
  logout?: () => void
}

const LogoutButton = ({ logout }: LogoutButtonProps) => {
  return (
    <button className="btn primary" onClick={logout}>
      Ausloggen
    </button>
  )
}

export default LogoutButton
