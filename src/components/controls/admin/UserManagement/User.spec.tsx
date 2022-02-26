import React from "react"
import { render, screen } from "@testing-library/react"
import User from "./User"

describe("User", () => {
  const onDelete = jest.fn()

  beforeEach(() => {
    onDelete.mockReset()
    render(<User username="john" onDelete={onDelete} />)
  })

  describe("when the delete button is clicked", () => {
    beforeEach(() => {
      screen.getByTitle("Löschen").click()
    })

    it("calls the onDelete callback with the username", () => {
      expect(onDelete).toHaveBeenCalledWith("john")
    })
  })
})
