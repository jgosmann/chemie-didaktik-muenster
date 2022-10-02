import React from "react"
import { act, render, screen } from "@testing-library/react"
import CopyButton from "./CopyButton"

describe("CopyButton", () => {
  it("sets clipboard with getCopyText return value", () => {
    Object.assign(global.navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    })

    const getCopyText = () => "text to copy"
    render(<CopyButton getCopyText={getCopyText} />)

    act(() => screen.getByRole("button").click())

    expect(global.navigator.clipboard.writeText).toHaveBeenLastCalledWith(
      "text to copy"
    )
  })
})
