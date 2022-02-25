import {
  faCheckCircle,
  faCog,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

export enum State {
  Unchanged = "unchanged",
  Changed = "changed",
  Saving = "saving",
  SavedSuccesfully = "saved-succesfully",
  Failure = "failure",
}

export interface SaveButtonProps {
  state: State
  onClick: (ev: React.FormEvent) => void
}

const SaveButton = ({ state, onClick }: SaveButtonProps): JSX.Element => (
  <button
    disabled={state !== State.Changed && state !== State.Failure}
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
    ) : state === State.Failure ? (
      <>
        <FontAwesomeIcon icon={faTimesCircle} className="mr-2 text-xl" />
        Fehler: erneut versuchen?
      </>
    ) : (
      "Änderungen speichern"
    )}
  </button>
)

export default SaveButton
