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
  render: (username: string, logout: () => void) => React.ReactNode
}

const AuthController = ({ render }: AuthControllerProps) => {
  const [message, setMessage] = useState<LoginMessage | null>(null)
  const [auth, setAuth] = useState<{ token: string; username: string } | null>(
    typeof window !== "undefined" &&
      JSON.parse(window.sessionStorage.getItem("auth"))
  )
  const [authPromise, setAuthPromise] = useState<
    Promise<[string, TokenResponse] | null>
  >(new Promise(resolve => resolve(null)))
  const promiseState = usePromise(authPromise)

  useEffect(() => {
    if (auth) {
      window?.sessionStorage.setItem("auth", JSON.stringify(auth))
    } else {
      window?.sessionStorage.removeItem("auth")
    }
  }, [auth])
  useEffect(() => {
    if (promiseState instanceof FulfilledPromise && promiseState.value) {
      const [username, tokenResponse] = promiseState.value
      setAuth({ token: tokenResponse.access_token, username })
      const timeoutID = setTimeout(() => {
        setAuth(null)
        setMessage({
          type: Type.Info,
          text: "Die Sitzung ist abgelaufen. Bitte erneut einloggen.",
        })
      }, Math.max(0, tokenResponse.expires_in - 60) * 1000)
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
        client.request
          .request<TokenResponse>({
            method: "POST",
            url: "/auth/token",
            body,
            mediaType: "application/x-www-form-urlencoded",
            errors: {
              422: `Validation Error`,
            },
          })
          .then(response => [username, response])
      )
    },
    [client]
  )

  if (auth) {
    return (
      <AnalyticsClientContext.Provider
        value={createClient({ TOKEN: auth.token })}
      >
        {render(auth.username, () => {
          setAuth(null)
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
