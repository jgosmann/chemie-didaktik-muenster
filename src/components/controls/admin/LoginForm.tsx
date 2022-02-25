import { faCog } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as React from "react"
import { useRef } from "react"
import InputField from "../../InputField"
import Message, { Type } from "../../Message"

export interface LoginMessage {
  type: Type
  text: string
}

export interface LoginFormProps {
  onSubmit?: (username: string, password: string) => void
  isProcessing?: boolean
  message?: LoginMessage
}

const LoginForm = ({ onSubmit, isProcessing, message }: LoginFormProps) => {
  const formRef = useRef(null)
  const usernameRef = useRef(null)
  const passwordRef = useRef(null)

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus()
    }
  }, [usernameRef])

  return (
    <form ref={formRef}>
      {message && (
        <Message type={message.type} className="mb-2">
          {message.text}
        </Message>
      )}
      <div className="mb-2">
        <label htmlFor="username" className="block mb-1">
          Benutzername
        </label>
        <InputField
          ref={usernameRef}
          id="username"
          name="username"
          type="text"
          className="w-full"
          disabled={isProcessing}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block mb-1">
          Passwort
        </label>
        <InputField
          ref={passwordRef}
          id="password"
          name="password"
          type="password"
          className="w-full"
          disabled={isProcessing}
          required
        />
      </div>
      <button
        type="submit"
        className="btn primary w-full"
        disabled={isProcessing}
        onClick={ev => {
          ev.preventDefault()
          if (formRef.current?.reportValidity() && onSubmit) {
            const username = usernameRef.current?.value
            const password = passwordRef.current?.value
            onSubmit(username, password)
          }
        }}
      >
        {isProcessing ? (
          <FontAwesomeIcon icon={faCog} className="text-xl animate-spin mr-2" />
        ) : null}
        Einloggen
      </button>
    </form>
  )
}

export default LoginForm
