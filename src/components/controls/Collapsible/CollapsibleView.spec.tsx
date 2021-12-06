import { render, screen } from "@testing-library/react"
import React from "react"
import CollapsibleView from "./CollapsibleView"

describe("CollapsibleView", () => {
  it("calls onToggle when clicking the toggle button", () => {
    const onToggle = jest.fn()
    render(
      <CollapsibleView onToggle={onToggle} label="Label" isExpanded>
        children
      </CollapsibleView>
    )

    screen.getByRole("button").click()

    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})
