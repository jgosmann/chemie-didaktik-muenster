import React from "react"
import { render, screen } from "@testing-library/react"
import SearchInput from "./SearchInput"
import { userEvent } from "@storybook/testing-library"

describe("SearchInput", () => {
  const onQueryChange = jest.fn()

  beforeEach(() => {
    onQueryChange.mockReset()
    render(<SearchInput onQueryChange={onQueryChange} />)
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
