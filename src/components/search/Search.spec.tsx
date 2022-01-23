import React from "react"
import { render, screen } from "@testing-library/react"
import { userEvent } from "@storybook/testing-library"
import FlexSearch from "flexsearch"
import Search from "./Search"

describe("Search", () => {
  const onQueryChange = jest.fn()
  const searchData = {
    index: FlexSearch.create().export(),
    store: {},
  }

  beforeEach(() => {
    onQueryChange.mockReset()
    render(<Search searchData={searchData} onQueryChange={onQueryChange} />)
  })

  describe("when the input value is changed", () => {
    beforeEach(() => {
      userEvent.type(screen.getByRole("textbox"), "search query")
    })

    it("calls onQueryChange with the new value", () => {
      expect(onQueryChange).toHaveBeenLastCalledWith("search query")
    })
  })
})
