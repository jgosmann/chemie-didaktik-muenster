import React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import LoginButton from "./LoginButton"
import LogoutButton from "./LogoutButton"

const AdminArea = (): JSX.Element => {
  const { isAuthenticated, isLoading } = useAuth0()

  if (isLoading) {
    return <p>Lade, bitte warten ...</p>
  }

  if (!isAuthenticated) {
    return <LoginButton />
  }

  return (
    <>
      Logged in.
      <LogoutButton />
    </>
  )
}

export default AdminArea
