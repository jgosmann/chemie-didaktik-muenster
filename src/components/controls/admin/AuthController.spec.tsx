import React from "react"
import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import AnalyticsClientContext, { createClient } from "./AnalyticsClient"
import AuthController from "./AuthController"
import { ApiError, TokenResponse } from "../../../../analytics-client"

const it_shows_the_login_form = () =>
  it("shows the login form", async () => {
    await waitFor(() => {
      expect(screen.getByLabelText("Benutzername")).toBeInTheDocument()
      expect(screen.getByLabelText("Passwort")).toBeInTheDocument()
      expect(screen.getByText("Einloggen")).toBeInTheDocument()
    })
  })

const login = async () => {
  await act(async () => {
    userEvent.type(screen.getByLabelText("Benutzername"), "username")
    userEvent.type(screen.getByLabelText("Passwort"), "password")
    screen.getByText("Einloggen").click()
  })
}

describe("AuthController", () => {
  const baseClient = createClient()
  const mockClient = {
    ...baseClient,
    request: {
      ...baseClient.request,
      request: jest.fn(),
    },
  }

  let stallRequest = false
  let continueRequest

  let failLogin = false
  let failLoginRequest = false

  beforeAll(() => jest.useFakeTimers())

  afterAll(() => jest.useRealTimers())

  beforeEach(async () => {
    window.sessionStorage.clear()

    mockClient.request.request.mockReset()
    mockClient.request.request.mockImplementation(
      () =>
        new Promise<TokenResponse>((resolve, reject) => {
          continueRequest = () => {
            continueRequest = undefined
            if (failLoginRequest) {
              reject("login request failed")
            } else if (failLogin) {
              reject(
                new ApiError(
                  {
                    method: "POST",
                    url: "/auth/token",
                  },
                  {
                    ok: false,
                    url: "login",
                    status: 400,
                    body: {
                      error: "invalid_grant",
                      error_description: "Invalid credentials given.",
                    },
                    statusText: "Bad Request",
                  },
                  "failed login"
                )
              )
            } else {
              resolve({
                access_token: "token",
                expires_in: 3600,
                scope: "scope",
                token_type: TokenResponse.token_type.BEARER,
              })
            }
          }
          if (!stallRequest) continueRequest()
        })
    )

    await act(async () => {
      render(
        <AnalyticsClientContext.Provider value={mockClient}>
          <AuthController
            render={(username, logout) => (
              <div data-testid="render">
                <div data-testid="username">{username}</div>
                <button onClick={logout} data-testid="logout">
                  logout
                </button>
              </div>
            )}
          />
        </AnalyticsClientContext.Provider>
      )
    })
  })

  describe("initially", () => {
    it_shows_the_login_form()

    it("does not show an error", () => {
      expect(screen.queryByTitle("Erfolg")).not.toBeInTheDocument()
      expect(screen.queryByTitle("Information")).not.toBeInTheDocument()
      expect(screen.queryByTitle("Warnung")).not.toBeInTheDocument()
      expect(screen.queryByTitle("Fehler")).not.toBeInTheDocument()
    })
  })

  describe("while the login is ongoing", () => {
    beforeEach(async () => {
      stallRequest = true
      await login()
      await waitFor(() => {
        expect(mockClient.request.request).toHaveBeenCalled()
      })
    })

    afterEach(async () => {
      await act(async () => continueRequest && continueRequest())
      stallRequest = false
    })

    it("disables the login form", async () => {
      await waitFor(() => {
        expect(screen.getByLabelText("Benutzername")).toBeDisabled()
        expect(screen.getByLabelText("Passwort")).toBeDisabled()
        expect(screen.getByText("Einloggen")).toBeDisabled()
      })
    })
  })

  describe("after logging in", () => {
    beforeEach(async () => {
      await login()
      await waitFor(() => {
        expect(mockClient.request.request).toHaveBeenCalled()
      })
    })

    it("shows the return value of the render function", async () => {
      await waitFor(() => {
        expect(screen.queryByTestId("render")).toBeInTheDocument()
        expect(screen.queryByTestId("username")).toHaveTextContent("username")
      })
    })

    describe("after the token has expired", () => {
      beforeEach(async () => {
        await act(async () => jest.advanceTimersByTime(3600 * 1000))
      })

      it_shows_the_login_form()

      it("shows the logout due to expired token message", () => {
        expect(
          screen.getByText(
            "Die Sitzung ist abgelaufen. Bitte erneut einloggen."
          )
        )
        expect(screen.getByTitle("Information")).toBeInTheDocument()
      })
    })

    describe("after logging out", () => {
      beforeEach(() => {
        act(() => screen.getByTestId("logout").click())
      })

      it_shows_the_login_form()

      it("shows the logout message", async () => {
        await waitFor(() => {
          expect(screen.getByText("Sie haben sich ausgeloggt."))
            .toBeInTheDocument
        })
        expect(screen.getByTitle("Erfolg")).toBeInTheDocument()
      })
    })
  })

  describe("when trying to log in with invalid credentials", () => {
    beforeEach(async () => {
      failLogin = true
      await login()
    })

    afterEach(() => {
      failLogin = false
    })

    it_shows_the_login_form()

    it("shows the invalid credentials message", async () => {
      await waitFor(() => {
        expect(
          screen.getByText("Die Login-Daten waren inkorrekt.")
        ).toBeInTheDocument()
      })
      expect(screen.getByTitle("Warnung")).toBeInTheDocument()
    })
  })

  describe("when an error occurs during login", () => {
    beforeEach(async () => {
      jest.spyOn(console, "error").mockImplementation(() => undefined)
      failLoginRequest = true
      await login()
    })

    afterEach(() => {
      failLoginRequest = false
    })

    it_shows_the_login_form()

    it("shows an error message", async () => {
      await waitFor(() => {
        expect(screen.getByText("Es ist ein Fehler aufgetreten."))
        expect(screen.getByTitle("Fehler")).toBeInTheDocument()
      })
    })
  })
})
