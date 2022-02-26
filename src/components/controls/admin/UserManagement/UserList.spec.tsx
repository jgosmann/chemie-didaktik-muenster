import React from "react"
import { act, render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import UserList from "./UserList"
import server, { waitForRequest } from "../../../../mocks/server"
import { withBaseUrl } from "../../../../mocks/handlers"
import { rest } from "msw"

describe("UserList", () => {
  beforeEach(() => {
    render(
      <UserList
        loggedInUser="foo"
        initialUsers={[
          { username: "user0" },
          { username: "user1" },
          { username: "foo" },
        ]}
      />
    )
  })

  describe("when adding a user", () => {
    beforeEach(async () => {
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
      await act(async () => screen.getByText("Benutzer hinzufügen").click())
    })

    it("adds the user to the list", async () => {
      await waitFor(() => {
        expect(screen.getByText("username (Real Name)")).toBeInTheDocument()
        expect(screen.getByText("comment")).toBeInTheDocument()
      })
    })
  })

  describe("when deleting a user", () => {
    it("sends a delete request for the user and removes the user out of the list", async () => {
      const requestPromise = waitForRequest(
        "DELETE",
        withBaseUrl("/users/user0")
      )

      await act(async () =>
        within(screen.getAllByRole("listitem")[0]).getByTitle("Löschen").click()
      )

      expect(await requestPromise).toBeDefined()
      await waitFor(() => {
        expect(screen.queryByText("user0")).not.toBeInTheDocument()
      })
    })

    describe("and the deletion request fails", () => {
      beforeEach(async () => {
        jest.spyOn(console, "error").mockImplementation(() => undefined)
        server.use(
          rest.delete(withBaseUrl("/users/user0"), (req, res, ctx) =>
            res(ctx.status(500))
          )
        )
        const requestPromise = waitForRequest(
          "DELETE",
          withBaseUrl("/users/user0")
        )

        await act(async () =>
          within(screen.getAllByRole("listitem")[0])
            .getByTitle("Löschen")
            .click()
        )
        expect(await requestPromise).toBeDefined()
      })

      it("restores the user in the list", async () => {
        await waitFor(() => {
          expect(screen.queryByText("user0")).toBeInTheDocument()
        })
      })
    })
  })
})
