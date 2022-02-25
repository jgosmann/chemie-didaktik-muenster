import React, { useCallback } from "react"
import { useState } from "react"
import SaveButton, { State } from "./SaveButton"

export interface SaveFormProps {
  children?: React.ReactNode
  save: () => Promise<void>
  disabled?: boolean
}

const SaveForm = ({ children, save, disabled }: SaveFormProps): JSX.Element => {
  const [state, setState] = useState(State.Unchanged)

  const onChange = useCallback(() => {
    setState(State.Changed)
  }, [])

  const onSave = useCallback(
    ev => {
      ev.preventDefault()
      setState(State.Saving)
      save()
        .then(() => {
          setState(State.SavedSuccesfully)
        })
        .catch(e => {
          setState(State.Failure)
          console.error(e)
        })
    },
    [save]
  )

  return (
    <form onChange={onChange}>
      {children}
      <SaveButton state={state} onClick={onSave} disabled={disabled} />
    </form>
  )
}

export default SaveForm
