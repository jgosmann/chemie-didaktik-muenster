import { faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useCallback } from "react"
import DeleteButton from "./DeleteButton"

export interface UserData {
  username: string
  realname?: string
  comment?: string
}

export interface UserProps extends UserData {
  disableDeletion?: boolean
  onDelete?: (name: string) => void
}

const User = ({
  username,
  realname,
  comment,
  onDelete,
  disableDeletion,
}: UserProps) => {
  const confirm = useCallback(() => {
    if (
      window.confirm(
        `Sind Sie sicher, dass sie den Benutzer '${username}' löschen möchten?`
      )
    ) {
      onDelete(username)
    }
  }, [username, onDelete])

  return (
    <div className="flex gap-4 items-center">
      <FontAwesomeIcon icon={faUser} />
      <div className="grow">
        {username}
        {realname && ` (${realname})`}
        {comment && <p className="text-xs text-gray-800">{comment}</p>}
      </div>
      {!disableDeletion && <DeleteButton onClick={confirm} />}
    </div>
  )
}

export default User
