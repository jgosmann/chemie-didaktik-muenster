import React from "react"
import { act, render, screen } from "@testing-library/react"
import CryptedEmail from "./Email"

describe("CryptedEmail", () => {
  it("sets clipboard with email when the copy button is clicked", () => {
    Object.assign(global.navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    })

    render(<CryptedEmail name="name" domain="domain" tld="tld" />)

    act(() => screen.getByTitle("E-Mail kopieren").click())

    expect(global.navigator.clipboard.writeText).toHaveBeenLastCalledWith(
      "name@domain.tld"
    )
  })
})
