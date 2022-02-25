import React from "react"
import { render, screen } from "@testing-library/react"
import Input from "./Input"
import userEvent from "@testing-library/user-event"

describe("Input", () => {
  const onChange = jest.fn()

  beforeEach(() => {
    onChange.mockReset()
  })

  it("calls the onChange callback when changed", () => {
    render(<Input trackedDomains={[]} onChange={onChange} />)
    userEvent.type(
      screen.getByRole("textbox"),
      "foo,,bar.org baz.com\nexample.org"
    )
    expect(onChange).toHaveBeenLastCalledWith([
      "foo",
      "bar.org",
      "baz.com",
      "example.org",
    ])
  })
})
