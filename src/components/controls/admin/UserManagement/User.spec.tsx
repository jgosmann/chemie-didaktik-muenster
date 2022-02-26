import React from "react"
import { render, screen } from "@testing-library/react"
import User from "./User"

describe("User", () => {
  const onDelete = jest.fn()

  beforeEach(() => {
    onDelete.mockReset()
    render(<User username="john" onDelete={onDelete} />)
  })

  describe("when the delete button is clicked and deletion is confirmed", () => {
    beforeEach(() => {
      window.confirm = jest.fn(() => true)
      screen.getByTitle("Löschen").click()
    })

    it("calls the onDelete callback with the username", () => {
      expect(onDelete).toHaveBeenCalledWith("john")
    })
  })

  describe("when the delete button is clicked and deletion is NOT confirmed", () => {
    beforeEach(() => {
      window.confirm = jest.fn(() => false)
      screen.getByTitle("Löschen").click()
    })

    it("dose NOT call the onDelete callback with the username", () => {
      expect(onDelete).not.toHaveBeenCalled()
    })
  })
})
