import React from "react"
import { render, screen } from "@testing-library/react"
import CryptedPhone from "./Phone"

describe("CryptedPhone", () => {
  it("sets clipboard with phone number when the copy button is clicked", () => {
    Object.assign(global.navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    })

    render(<CryptedPhone country="+49" area="174" block0="123" block1="4567" />)

    screen.getByTitle("Telefonnummer kopieren").click()

    expect(global.navigator.clipboard.writeText).toHaveBeenLastCalledWith(
      "+491741234567"
    )
  })
})
