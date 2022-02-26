import React, { useCallback, useContext, useRef } from "react"
import SaveableForm from "../SaveableForm"
import InputField from "../../../InputField"
import AnalyticsClientContext from "../AnalyticsClient"
import { UserData } from "../../../../../analytics-client"

export interface AddUserProps {
  onUserAdded?: (user: UserData) => void
}

const AddUser = ({ onUserAdded }: AddUserProps) => {
  const usernameRef = useRef(null)
  const realnameRef = useRef(null)
  const commentRef = useRef(null)
  const passwordRef = useRef(null)
  const passwordConfirmationRef = useRef(null)

  const analyticsClient = useContext(AnalyticsClientContext)
  const save = useCallback(() => {
    return analyticsClient.default
      .putUserUsersUsernamePut(usernameRef.current.value, {
        realname: realnameRef.current.value,
        comment: commentRef.current.value,
        password: passwordRef.current.value,
      })
      .then(
        () =>
          onUserAdded &&
          onUserAdded({
            username: usernameRef.current.value,
            realname: realnameRef.current.value,
            comment: commentRef.current.value,
          })
      )
  }, [analyticsClient])

  const checkValidity = useCallback(() => {
    if (passwordRef.current.value !== passwordConfirmationRef.current.value) {
      passwordConfirmationRef.current.setCustomValidity(
        "Die Passwörter müssen übereinstimmen."
      )
    } else {
      passwordConfirmationRef.current.setCustomValidity("")
    }
  }, [])

  const onSaveSucceeded = useCallback(() => {
    usernameRef.current.value = ""
    realnameRef.current.value = ""
    commentRef.current.value = ""
    passwordRef.current.value = ""
    passwordConfirmationRef.current.value = ""
  }, [])

  return (
    <SaveableForm
      save={save}
      saveLabel="Benutzer hinzufügen"
      onChange={checkValidity}
      onSaveSucceeded={onSaveSucceeded}
    >
      <div className="grid grid-cols-2 max-w-md gap-4">
        <div>
          <label htmlFor="username" className="block mb-1">
            Benutzername (für Login)
          </label>
          <InputField
            ref={usernameRef}
            type="text"
            name="username"
            id="username"
            required
            placeholder="mmuster"
          />
        </div>
        <div>
          <label htmlFor="realname" className="block mb-1">
            Name (optional)
          </label>
          <InputField
            ref={realnameRef}
            type="text"
            name="realname"
            id="realname"
            placeholder="Max Mustermann"
          />
        </div>
        <div className="col-span-2">
          <label htmlFor="comment" className="block mb-1">
            Kommentar (optional)
          </label>
          <InputField
            ref={commentRef}
            type="text"
            name="comment"
            id="comment"
            placeholder="Kommentar"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            Passwort
          </label>
          <InputField
            ref={passwordRef}
            type="password"
            name="password"
            id="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>
        <div>
          <label htmlFor="password-confirmation" className="block mb-1">
            Passwort bestätigen
          </label>
          <InputField
            ref={passwordConfirmationRef}
            type="password"
            name="password-confirmation"
            id="password-confirmation"
            autoComplete="new-password"
          />
        </div>
      </div>
    </SaveableForm>
  )
}

export default AddUser
