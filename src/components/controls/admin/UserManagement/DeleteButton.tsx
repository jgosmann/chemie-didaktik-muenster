import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import React from "react"

export interface DeleteButtonProps {
  onClick?: () => void
}

const DeleteButton = ({ onClick }: DeleteButtonProps) => (
  <button
    onClick={onClick}
    className="btn w-0 p-2 hover:bg-red-200"
    title="Löschen"
  >
    <FontAwesomeIcon icon={faTrashAlt} />
  </button>
)

export default DeleteButton
