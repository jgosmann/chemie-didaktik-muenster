import { act, render, screen, waitFor } from "@testing-library/react"
import React from "react"
import DataLoader from "./DataLoader"

const createMockPromise = () => {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return [promise, resolve, reject]
}

describe("DataLoader", () => {
  describe("initially", () => {
    it("shows the loading spinner", () => {
      const [promise] = createMockPromise()
      render(<DataLoader load={() => promise} render={() => null} />)
      expect(screen.getByTitle("Wird geladen")).toBeInTheDocument()
    })
  })

  describe("after resolving the promise", () => {
    it("renders the promise value", async () => {
      const [promise, resolve] = createMockPromise()
      render(
        <DataLoader
          load={() => promise}
          render={value => <div data-testid="value">{value}</div>}
        />
      )
      act(() => resolve("resolved value"))
      await waitFor(() => {
        expect(screen.getByTestId("value")).toHaveTextContent("resolved value")
      })
    })
  })

  describe("after rejecting the promise", () => {
    it("renders an error message", async () => {
      const [promise, , reject] = createMockPromise()
      render(<DataLoader load={() => promise} render={() => null} />)
      act(() => reject("error value"))
      await waitFor(() => {
        expect(screen.getByTitle("Fehler")).toBeInTheDocument()
      })
    })
  })
})
