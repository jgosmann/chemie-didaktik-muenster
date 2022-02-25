import { act, render, screen, waitFor } from "@testing-library/react"
import React from "react"
import usePromise, {
  RejectedPromise,
  FulfilledPromise,
  PendingPromise,
} from "./usePromise"

const createMockPromise = () => {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return [promise, resolve, reject]
}

interface RenderUsePromiseProps<T> {
  promise: Promise<T>
}

const RenderUsePromise = function <T>({ promise }: RenderUsePromiseProps<T>) {
  const promiseState = usePromise(promise)

  if (promiseState instanceof PendingPromise) {
    return (
      <div>
        <div data-testid="type">pending</div>
      </div>
    )
  } else if (promiseState instanceof FulfilledPromise) {
    return (
      <div>
        <div data-testid="type">fulfilled</div>
        <div data-testid="value">{promiseState.value}</div>
      </div>
    )
  } else if (promiseState instanceof RejectedPromise) {
    return (
      <div>
        <div data-testid="type">rejected</div>
        <div data-testid="error">{promiseState.error}</div>
      </div>
    )
  } else {
    throw "invalid state"
  }
}

describe("usePromise", () => {
  describe("initially", () => {
    it("returns an PendingPromise", () => {
      const [promise] = createMockPromise()
      render(<RenderUsePromise promise={promise} />)
      expect(screen.getByTestId("type")).toHaveTextContent("pending")
    })
  })

  describe("after resolving the promise", () => {
    it("returns a FulfilledPromise", async () => {
      const [promise, resolve] = createMockPromise()
      render(<RenderUsePromise promise={promise} />)
      act(() => resolve("resolved value"))
      await waitFor(() => {
        expect(screen.getByTestId("type")).toHaveTextContent("fulfilled")
        expect(screen.getByTestId("value")).toHaveTextContent("resolved value")
      })
    })
  })

  describe("after rejecting the promise", () => {
    it("returns a RejectedPromise", async () => {
      const [promise, , reject] = createMockPromise()
      render(<RenderUsePromise promise={promise} />)
      act(() => reject("error value"))
      await waitFor(() => {
        expect(screen.getByTestId("type")).toHaveTextContent("rejected")
        expect(screen.getByTestId("error")).toHaveTextContent("error value")
      })
    })
  })
})
