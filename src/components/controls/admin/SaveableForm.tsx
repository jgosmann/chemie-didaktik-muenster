import React, { useCallback, useRef } from "react"
import { useState } from "react"
import SaveButton, { State } from "./SaveButton"

export interface SaveFormProps {
  children?: React.ReactNode
  save: () => Promise<void>
  disabled?: boolean
  saveLabel?: string
  onChange?: () => void
  formatError?: (error: unknown) => string
}

const SaveForm = ({
  children,
  save,
  saveLabel,
  disabled,
  onChange,
  formatError,
}: SaveFormProps): JSX.Element => {
  const formRef = useRef(null)
  const [state, setState] = useState(State.Unchanged)
  const [errorMessage, setErrorMessage] = useState<string>(null)

  const onChangeInternal = useCallback(() => {
    setState(State.Changed)
    if (onChange) onChange()
  }, [onChange])

  const onSave = useCallback(
    ev => {
      ev.preventDefault()
      if (formRef.current?.reportValidity()) {
        setState(State.Saving)
        save()
          .then(() => {
            setState(State.SavedSuccesfully)
            formRef.current.reset()
          })
          .catch(e => {
            setState(State.Failure)
            const message = formatError && formatError(e)
            if (message) {
              setErrorMessage(message)
            } else {
              console.error(e)
            }
          })
      }
    },
    [save]
  )

  return (
    <form
      onChange={onChangeInternal}
      ref={formRef}
      className={
        state === State.Unchanged || state == State.SavedSuccesfully
          ? ""
          : "changed"
      }
    >
      {children}
      <SaveButton
        saveLabel={saveLabel}
        state={state}
        onClick={onSave}
        disabled={disabled}
        errorMessage={errorMessage}
      />
    </form>
  )
}

export default SaveForm
