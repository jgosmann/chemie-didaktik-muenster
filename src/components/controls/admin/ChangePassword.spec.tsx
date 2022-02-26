import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { rest } from "msw"
import React from "react"
import { withBaseUrl } from "../../../mocks/handlers"
import server, { waitForRequest } from "../../../mocks/server"
import ChangePassword from "./ChangePassword"

describe("ChangePassword", () => {
  beforeEach(() => {
    render(<ChangePassword />)
  })

  describe("when the new password and confirmation password do not match", () => {
    beforeEach(async () => {
      await act(async () => {
        userEvent.type(screen.getByLabelText("Altes Passwort"), "old-secret")
        userEvent.type(screen.getByLabelText("Neues Passwort"), "secret1234")
        userEvent.type(
          screen.getByLabelText("Bestätigung des neuen Passworts"),
          "non-matching"
        )
        screen.getByRole("button").click()
      })
    })

    it("the confirmation input is not valid", () => {
      expect(
        screen.getByLabelText("Bestätigung des neuen Passworts")
      ).toBeInvalid()
    })
  })

  describe("when the new password and confirmation match", () => {
    beforeEach(async () => {
      await act(async () => {
        userEvent.type(screen.getByLabelText("Altes Passwort"), "old-secret")
        userEvent.type(screen.getByLabelText("Neues Passwort"), "secret1234")
        userEvent.type(
          screen.getByLabelText("Bestätigung des neuen Passworts"),
          "secret1234"
        )
      })
    })

    it("makes a request to change the password", async () => {
      const requestPromise = waitForRequest(
        "POST",
        withBaseUrl("/profile/change-password")
      )
      await act(async () => screen.getByRole("button").click())

      const request = await requestPromise
      expect(request.body).toEqual({
        old_password: "old-secret",
        new_password: "secret1234",
      })

      await waitFor(() => {
        expect(screen.getByText("Gespeichert")).toBeInTheDocument()
      })
    })

    describe("when the password change succeeds", () => {
      it("clears the input fields", async () => {
        await act(async () => screen.getByRole("button").click())
        await waitFor(() => {
          expect(screen.getByLabelText("Altes Passwort")).toHaveValue("")
          expect(screen.getByLabelText("Neues Passwort")).toHaveValue("")
          expect(
            screen.getByLabelText("Bestätigung des neuen Passworts")
          ).toHaveValue("")
        })
      })
    })

    describe("when the old password is incorrect", () => {
      beforeEach(async () => {
        server.use(
          rest.post(withBaseUrl("/profile/change-password"), (req, res, ctx) =>
            res(ctx.status(401))
          )
        )
        await act(async () => screen.getByRole("button").click())
      })

      it("shows a corresponding error", async () => {
        await waitFor(() => {
          expect(
            screen.getByText("Das alte Passwort ist ungültig.")
          ).toBeInTheDocument()
        })
      })
    })

    describe("when another error occurs", () => {
      beforeEach(async () => {
        jest.spyOn(console, "error").mockImplementation(() => undefined)
        server.use(
          rest.post(withBaseUrl("/profile/change-password"), (req, res, ctx) =>
            res(ctx.status(500))
          )
        )
        await act(async () => screen.getByRole("button").click())
      })

      it("show an error message", async () => {
        await waitFor(() => {
          expect(screen.getByTitle("Fehler")).toBeInTheDocument()
        })
      })
    })
  })
})
