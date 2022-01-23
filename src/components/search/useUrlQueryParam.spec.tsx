import React, { useRef } from "react"
import { render, screen } from "@testing-library/react"
import useUrlQueryParam from "./useUrlQueryParam"
import LocationContext from "../LocationContext"
import { userEvent } from "@storybook/testing-library"

const UseUrlQueryParamTestComponent = () => {
  const [query, setQuery] = useUrlQueryParam()
  const ref = useRef(null)
  return (
    <>
      <div data-testid="query">{query}</div>
      <input
        type="text"
        ref={ref}
        onChange={() => setQuery(ref.current.value)}
      />
    </>
  )
}

describe("useUrlQueryParam", () => {
  describe("when location has no query param", () => {
    it("returns the empty string as query", () => {
      render(<UseUrlQueryParamTestComponent />)
      expect(screen.getByTestId("query")).toHaveTextContent("")
    })

    it("updates the location when the query string changes", () => {
      render(<UseUrlQueryParamTestComponent />)
      expect(window.history.length).toBe(1)

      userEvent.type(screen.getByRole("textbox"), "foo")
      expect(new URLSearchParams(window.location.search).get("q")).toEqual(
        "foo"
      )
      expect(window.history.length).toBe(1)
    })
  })

  describe("when location has a query param", () => {
    it("extracts the query from the query param", () => {
      render(
        <LocationContext.Provider
          value={{
            pathname: "pathname",
            search: "?q=query-string",
            hash: "",
          }}
        >
          <UseUrlQueryParamTestComponent />
        </LocationContext.Provider>
      )
      expect(screen.getByTestId("query")).toHaveTextContent("query-string")
    })

    it("updates the location when the query string changes", () => {
      render(<UseUrlQueryParamTestComponent />)
      expect(window.history.length).toBe(1)

      userEvent.type(screen.getByRole("textbox"), "foo")
      expect(new URLSearchParams(window.location.search).get("q")).toEqual(
        "foo"
      )
      expect(window.history.length).toBe(1)
    })

    describe("when the location changes", () => {
      it("updates the extracted query param", () => {
        const { rerender } = render(
          <LocationContext.Provider
            value={{
              pathname: "pathname",
              search: "?q=query-string",
              hash: "",
            }}
          >
            <UseUrlQueryParamTestComponent />
          </LocationContext.Provider>
        )
        rerender(
          <LocationContext.Provider
            value={{
              pathname: "pathname",
              search: "?q=new-query-string",
              hash: "",
            }}
          >
            <UseUrlQueryParamTestComponent />
          </LocationContext.Provider>
        )

        expect(screen.getByTestId("query")).toHaveTextContent(
          "new-query-string"
        )
      })
    })
  })
})
