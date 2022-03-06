import React from "react"
import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import AddUser from "./AddUser"
import { withBaseUrl } from "../../../../mocks/handlers"
import server, { waitForRequest } from "../../../../mocks/server"
import { rest } from "msw"

describe("AddUser", () => {
  const onUserAdded = jest.fn()

  beforeEach(() => {
    onUserAdded.mockReset()
    render(<AddUser onUserAdded={onUserAdded} />)
  })

  it("requires a username", () => {
    expect(screen.getByLabelText("Benutzername (für Login)")).toBeInvalid()
  })

  it("requires a password", () => {
    expect(screen.getByLabelText("Passwort")).toBeInvalid()
  })

  it("requires the password confirmation to match", () => {
    act(() => {
      userEvent.type(screen.getByLabelText("Passwort"), "password")
      userEvent.type(
        screen.getByLabelText("Passwort bestätigen"),
        "supersecret"
      )
    })

    expect(screen.getByLabelText("Passwort bestätigen")).toBeInvalid()
  })

  describe("when adding a user", () => {
    beforeEach(() => {
      act(() => {
        userEvent.type(
          screen.getByLabelText("Benutzername (für Login)"),
          "username"
        )
        userEvent.type(screen.getByLabelText("Name (optional)"), "Real Name")
        userEvent.type(screen.getByLabelText("Kommentar (optional)"), "comment")
        userEvent.type(screen.getByLabelText("Passwort"), "password")
        userEvent.type(screen.getByLabelText("Passwort bestätigen"), "password")
      })
    })

    it("makes a request to add the user", async () => {
      const requestPromise = waitForRequest(
        "PUT",
        withBaseUrl("/users/username")
      )
      await act(async () => screen.getByRole("button").click())

      const request = await requestPromise
      expect(request.body).toEqual({
        realname: "Real Name",
        comment: "comment",
        password: "password",
      })

      await waitFor(() => {
        expect(screen.getByText("Gespeichert")).toBeInTheDocument()
      })
    })

    describe("after adding a user successfully", () => {
      beforeEach(async () => {
        await act(async () => screen.getByRole("button").click())
      })

      it("clears the inputs", async () => {
        await waitFor(() => {
          screen.getAllByRole("textbox").forEach(input => {
            expect(input).toHaveValue("")
          })
        })
      })

      it("calls onUserAdded", async () => {
        await waitFor(() => {
          expect(onUserAdded).toHaveBeenCalledWith({
            username: "username",
            realname: "Real Name",
            comment: "comment",
          })
        })
      })
    })

    describe("if the username already exists", () => {
      beforeEach(async () => {
        server.use(
          rest.put(withBaseUrl("/users/*"), (req, res, ctx) =>
            res(ctx.status(409))
          )
        )
        await act(async () => screen.getByRole("button").click())
      })

      it("shows an error message that he username exists", async () => {
        await waitFor(() => {
          expect(
            screen.getByLabelText("Benutzername (für Login)")
          ).toBeInvalid()
          expect(
            screen.getByText("Der Benutzername existiert bereits.")
          ).toBeInTheDocument()
        })
      })
    })
  })
})
