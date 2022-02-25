import React from "react"
import { render, screen } from "@testing-library/react"
import SaveButton, { State } from "./SaveButton"

describe("SaveButton", () => {
  const onClick = jest.fn()

  beforeEach(() => {
    onClick.mockReset()
  })
  ;[State.Changed, State.Failure].forEach(state => {
    describe(`when in ${state} state`, () => {
      it("calls the onClick callback when clicked", () => {
        render(<SaveButton state={state} onClick={onClick} />)
        screen.getByRole("button").click()
        expect(onClick).toHaveBeenCalledTimes(1)
      })
    })
  })
  ;[State.Unchanged, State.Saving, State.SavedSuccesfully].forEach(state => {
    describe(`when in ${state} state`, () => {
      it("does NOT call the onClick callback when clicked", () => {
        render(<SaveButton state={state} onClick={onClick} />)
        screen.getByRole("button").click()
        expect(onClick).not.toHaveBeenCalled()
      })
    })
  })
})
