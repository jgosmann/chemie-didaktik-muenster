import { faCheckCircle, faCog } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import Message, { Type } from "../../Message"

export enum State {
  Unchanged = "unchanged",
  Changed = "changed",
  Saving = "saving",
  SavedSuccesfully = "saved-succesfully",
  Failure = "failure",
}

export interface SaveButtonProps {
  disabled?: boolean
  state: State
  onClick: (ev: React.FormEvent) => void
}

const SaveButton = ({
  disabled,
  state,
  onClick,
}: SaveButtonProps): JSX.Element => (
  <>
    {state === State.Failure && (
      <Message type={Type.Error}>Es ist ein Fehler aufgetreten.</Message>
    )}
    <button
      disabled={
        disabled || (state !== State.Changed && state !== State.Failure)
      }
      className={`btn primary mt-2 ${
        state === State.SavedSuccesfully ? "!text-green-800" : ""
      }`}
      onClick={onClick}
    >
      {state === State.Saving ? (
        <>
          <FontAwesomeIcon icon={faCog} className="mr-2 text-xl animate-spin" />
          Speichern ...
        </>
      ) : state === State.SavedSuccesfully ? (
        <>
          <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-xl" />
          Gespeichert
        </>
      ) : (
        "Änderungen speichern"
      )}
    </button>
  </>
)

export default SaveButton
