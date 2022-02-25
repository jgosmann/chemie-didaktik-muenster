import React, { useCallback, useContext, useState } from "react"
import { useEffect } from "react"
import { ApiError } from "../../../../analytics-client"
import { TokenResponse } from "../../../../analytics-client/models/TokenResponse"
import usePromise, {
  FulfilledPromise,
  PendingPromise,
  RejectedPromise,
} from "../../../hooks/usePromise"
import { Type } from "../../Message"
import AnalyticsClientContext, { createClient } from "./AnalyticsClient"
import LoginForm, { LoginMessage } from "./LoginForm"

export interface AuthControllerProps {
  render: (logout: () => void) => React.ReactNode
}

const AuthController = ({ render }: AuthControllerProps) => {
  const [message, setMessage] = useState<LoginMessage | null>(null)
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" && window.sessionStorage.getItem("auth-token")
  )
  const [authPromise, setAuthPromise] = useState<Promise<TokenResponse | null>>(
    new Promise(resolve => resolve(null))
  )
  const promiseState = usePromise(authPromise)

  useEffect(() => {
    if (token) {
      window?.sessionStorage.setItem("auth-token", token)
    } else {
      window?.sessionStorage.removeItem("auth-token")
    }
  }, [token])
  useEffect(() => {
    if (promiseState instanceof FulfilledPromise && promiseState.value) {
      setToken(promiseState.value.access_token)
      const timeoutID = setTimeout(() => {
        setToken(null)
        setMessage({
          type: Type.Info,
          text: "Die Sitzung ist abgelaufen. Bitte erneut einloggen.",
        })
      }, Math.max(0, promiseState.value.expires_in - 60) * 1000)
      return () => clearTimeout(timeoutID)
    } else if (promiseState instanceof RejectedPromise) {
      if (
        promiseState.error instanceof ApiError &&
        promiseState.error.status == 400 &&
        promiseState.error.body.error == "invalid_grant"
      ) {
        setMessage({
          type: Type.Warning,
          text: "Die Login-Daten waren inkorrekt.",
        })
      } else {
        setMessage({ type: Type.Error, text: "Es ist ein Fehler aufgetreten." })
        console.error(promiseState.error)
      }
    }
  }, [promiseState])

  const client = useContext(AnalyticsClientContext)
  const login = useCallback(
    (username: string, password: string) => {
      setMessage(null)
      const body = Object.entries({
        grant_type: "password",
        client_id: "646ad66f-6815-4fdc-ae75-430fc8e4e556",
        username,
        password,
      })
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&")
      setAuthPromise(
        client.request.request({
          method: "POST",
          url: "/auth/token",
          body,
          mediaType: "application/x-www-form-urlencoded",
          errors: {
            422: `Validation Error`,
          },
        })
      )
    },
    [client]
  )

  if (token) {
    return (
      <AnalyticsClientContext.Provider value={createClient({ TOKEN: token })}>
        {render(() => {
          setToken(null)
          setMessage({ type: Type.Success, text: "Sie haben sich ausgeloggt." })
        })}
      </AnalyticsClientContext.Provider>
    )
  } else {
    return (
      <div className="max-w-sm">
        <LoginForm
          message={message}
          isProcessing={promiseState instanceof PendingPromise}
          onSubmit={login}
        />
      </div>
    )
  }
}

export default AuthController
