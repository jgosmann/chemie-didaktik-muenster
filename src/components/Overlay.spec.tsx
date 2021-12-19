import { fireEvent, render, screen } from "@testing-library/react"
import React from "react"
import Overlay from "./Overlay"

describe("Overlay", () => {
  const onClose = jest.fn()

  beforeEach(() => {
    onClose.mockReset()
  })

  describe("when inactive", () => {
    let overlay

    beforeEach(() => {
      const { container } = render(
        <Overlay isActive={false} onClose={onClose}>
          content
        </Overlay>
      )
      overlay = container.firstChild
    })

    it("it is not visible", () => {
      expect(overlay).not.toBeVisible()
    })

    it("does not react to press of escape", () => {
      fireEvent.keyDown(document.body, { key: "Escape", code: "Escape" })
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe("when active", () => {
    let overlay

    beforeEach(() => {
      const { container } = render(
        <Overlay isActive onClose={onClose}>
          content
        </Overlay>
      )
      overlay = container.firstChild
    })

    it("is visible", () => {
      expect(overlay).toBeVisible()
    })

    describe("when clicking the close button", () => {
      beforeEach(() => {
        screen.getByTitle("Schließen").click()
      })

      it("calls onClose", () => {
        expect(onClose).toHaveBeenCalledTimes(1)
      })
    })

    describe("when clicking the container", () => {
      beforeEach(() => {
        overlay.click()
      })

      it("calls onClose", () => {
        expect(onClose).toHaveBeenCalledTimes(1)
      })
    })

    describe("when pressing escape", () => {
      beforeEach(() => {
        fireEvent.keyDown(document.body, { key: "Escape", code: "Escape" })
      })

      it("calls onClose", () => {
        expect(onClose).toHaveBeenCalledTimes(1)
      })
    })
  })
})
