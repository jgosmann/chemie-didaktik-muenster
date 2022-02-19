import * as React from "react"
import { useAuth0 } from "@auth0/auth0-react"

const LoginButton = () => {
  const { logout } = useAuth0()

  return (
    <button
      className="btn primary"
      onClick={() => logout({ returnTo: window?.location.toString() })}
    >
      Ausloggen
    </button>
  )
}

export default LoginButton
