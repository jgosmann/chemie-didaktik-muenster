import React from "react"
import { render, screen, act, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { waitForRequest } from "../../../../mocks/server"
import TrackedDomainsControl from "./TrackedDomainsControl"
import { withBaseUrl } from "../../../../mocks/handlers"

describe("TrackedDomainsControl", () => {
  beforeEach(() => {
    render(<TrackedDomainsControl initialTrackedDomains={["foo.com"]} />)
  })

  describe("after changing the textfield", () => {
    beforeEach(async () => {
      await act(async () =>
        userEvent.type(screen.getByRole("textbox"), "\nexample.org")
      )
      await waitFor(() => {
        expect(screen.getByRole("button")).toBeEnabled()
      })
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

        await waitFor(() =>
          expect(screen.getByText("Gespeichert")).toBeInTheDocument()
        )
      })
    })
  })

  it("does not allow to save an empty domain list", async () => {
    await act(async () => userEvent.clear(screen.getByRole("textbox")))
    expect(screen.getByRole("button")).toBeDisabled()
  })
})
