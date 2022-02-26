import React from "react"
import { render, screen } from "@testing-library/react"
import DeleteButton from "./DeleteButton"

describe("DeleteButton", () => {
  const onClick = jest.fn()

  beforeEach(() => {
    onClick.mockReset()
    render(<DeleteButton onClick={onClick} />)
  })

  describe("when clicked", () => {
    beforeEach(() => {
      screen.getByRole("button").click()
    })

    it("calls the onClick callback", () => {
      expect(onClick).toHaveBeenCalled()
    })
  })
})
