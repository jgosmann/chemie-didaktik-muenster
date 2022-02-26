import React, { useCallback, useContext, useState } from "react"
import AnalyticsClientContext from "../AnalyticsClient"
import AddUser from "./AddUser"
import User, { UserData } from "./User"

export interface UserListProps {
  initialUsers: UserData[]
  loggedInUser: string
}

const UserList = ({ initialUsers, loggedInUser }: UserListProps) => {
  const [users, setUsers] = useState(initialUsers)

  const onUserAdded = useCallback(user => {
    setUsers(users => [...users, user])
  }, [])

  const analyticsClient = useContext(AnalyticsClientContext)
  const onDelete = useCallback(username => {
    const userIndex = users.findIndex(user => user.username === username)
    const user = users[userIndex]
    setUsers(users => users.filter(user => user.username !== username))
    analyticsClient.default.deleteUserUsersUsernameDelete(username).catch(e => {
      setUsers(users => [
        ...users.slice(0, userIndex),
        user,
        ...users.slice(userIndex),
      ])
      console.error(e)
    })
  }, [])

  return (
    <>
      <h2 className="text-xl">Benutzermanagement</h2>
      <ul className="divide-y">
        {users.map(user => (
          <li key={user.username} className="py-2">
            <User
              {...user}
              onDelete={onDelete}
              disableDeletion={
                loggedInUser === user.username || users.length <= 1
              }
            />
          </li>
        ))}
      </ul>
      <h3 className="text-lg mt-2">Neuen Benutzer anlegen</h3>
      <AddUser onUserAdded={onUserAdded} />
    </>
  )
}

export default UserList
