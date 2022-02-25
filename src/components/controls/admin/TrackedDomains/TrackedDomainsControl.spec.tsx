import React from "react"
import { render, screen, act, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import server, { waitForRequest } from "../../../../mocks/server"
import TrackedDomainsControl from "./TrackedDomainsControl"
import { rest } from "msw"
import { withBaseUrl } from "../../../../mocks/handlers"

describe("TrackedDomainsControl", () => {
  beforeEach(() => {
    render(<TrackedDomainsControl initialTrackedDomains={["foo.com"]} />)
  })

  describe("initially", () => {
    it("renders the save button in unchanged state", () => {
      expect(screen.getByRole("button")).toHaveTextContent(
        "Änderungen speichern"
      )
      expect(screen.getByRole("button")).toBeDisabled()
    })
  })

  describe("after changing the textfield", () => {
    beforeEach(async () => {
      await act(async () =>
        userEvent.type(screen.getByRole("textbox"), "\nexample.org")
      )
    })

    it("renders the save button in changed state", () => {
      expect(screen.getByRole("button")).toHaveTextContent(
        "Änderungen speichern"
      )
      expect(screen.getByRole("button")).toBeEnabled()
    })

    describe("when clicking the save button", () => {
      it("makes an API request with the entered data", async () => {
        const requestPromise = waitForRequest(
          "PUT",
          withBaseUrl("/tracked/domains")
        )
        await act(async () => screen.getByRole("button").click())

        const request = await requestPromise
        expect(request.body).toEqual({
          tracked_domains: ["foo.com", "example.org"],
        })
      })

      it("renders the save button first in saving state and switches then to succesfully-saved state", async () => {
        let resolveRequest
        server.use(
          rest.put(
            withBaseUrl("/tracked/domains"),
            (req, res, ctx) =>
              new Promise(resolve => {
                resolveRequest = () => act(() => resolve(res(ctx.status(204))))
              })
          )
        )
        await act(async () => screen.getByRole("button").click())

        expect(screen.getByRole("button")).toHaveTextContent("Speichern ...")
        expect(screen.getByRole("button")).toBeDisabled()

        resolveRequest()

        await waitFor(() => {
          expect(screen.getByRole("button")).toHaveTextContent("Gespeichert")
          expect(screen.getByRole("button")).toBeDisabled()
        })
      })
    })

    describe("when saving fails", () => {
      beforeEach(async () => {
        jest.spyOn(console, "error").mockImplementation(() => undefined)
        server.use(
          rest.put(withBaseUrl("/tracked/domains"), (req, res, ctx) =>
            res(ctx.status(500))
          )
        )
        await act(async () => screen.getByRole("button").click())
      })

      it("renders the save button in failure state", async () => {
        await waitFor(() => {
          expect(screen.getByRole("button")).toHaveTextContent(
            "Fehler: erneut versuchen?"
          )
          expect(screen.getByRole("button")).toBeEnabled()
        })
      })
    })
  })

  it("does not allow to save an empty domain list", async () => {
    await act(async () => userEvent.clear(screen.getByRole("textbox")))
    expect(screen.getByRole("button")).toBeDisabled()
  })
})
