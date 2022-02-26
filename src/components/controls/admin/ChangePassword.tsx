import React, { useCallback, useContext, useRef } from "react"
import { ApiError } from "../../../../analytics-client"
import InputField from "../../InputField"
import AnalyticsClientContext from "./AnalyticsClient"
import SaveableForm from "./SaveableForm"

const ChangePassword = () => {
  const oldPasswordRef = useRef(null)
  const newPasswordRef = useRef(null)
  const newPasswordConfirmationRef = useRef(null)

  const analyticsClient = useContext(AnalyticsClientContext)
  const save = useCallback(
    () =>
      analyticsClient.default.changePasswordProfileChangePasswordPost({
        old_password: oldPasswordRef.current.value,
        new_password: newPasswordRef.current.value,
      }),
    [analyticsClient]
  )

  const checkValidity = useCallback(() => {
    if (
      newPasswordRef.current.value !== newPasswordConfirmationRef.current.value
    ) {
      newPasswordConfirmationRef.current.setCustomValidity(
        "Die Passwörter müssen übereinstimmen."
      )
    } else {
      newPasswordConfirmationRef.current.setCustomValidity("")
    }
  }, [])

  const onSaveSucceeded = useCallback(() => {
    oldPasswordRef.current.value = ""
    newPasswordRef.current.value = ""
    newPasswordConfirmationRef.current.value = ""
  }, [])
  const formatError = useCallback(err => {
    if (err instanceof ApiError && err.status == 401) {
      return "Das alte Passwort ist ungültig."
    }
  }, [])

  return (
    <SaveableForm
      saveLabel="Passwort ändern"
      save={save}
      onChange={checkValidity}
      onSaveSucceeded={onSaveSucceeded}
      formatError={formatError}
    >
      <h2 className="text-xl mt-4 mb-1">Passwort ändern</h2>
      <div className="mb-2">
        <label htmlFor="old-password" className="block mb-1">
          Altes Passwort
        </label>
        <InputField
          ref={oldPasswordRef}
          type="password"
          name="old-password"
          id="old-password"
          autoComplete="current-password"
        />
      </div>
      <div className="mb-2">
        <label htmlFor="new-password" className="block mb-1">
          Neues Passwort
        </label>
        <InputField
          ref={newPasswordRef}
          type="password"
          name="new-password"
          id="new-password"
          autoComplete="new-password"
          minLength={8}
        />
      </div>
      <div className="mb-2">
        <label htmlFor="new-password-confirmation" className="block mb-1">
          Bestätigung des neuen Passworts
        </label>
        <InputField
          ref={newPasswordConfirmationRef}
          type="password"
          name="new-password-confirmation"
          id="new-password-confirmation"
          autoComplete="new-password"
        />
      </div>
    </SaveableForm>
  )
}

export default ChangePassword
