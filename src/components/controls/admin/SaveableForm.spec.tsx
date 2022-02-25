import React from "react"
import { render, screen, act, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import SaveableForm from "./SaveableForm"

describe("SaveableForm", () => {
  let resolveSave, rejectSave
  const save: () => Promise<void> = jest.fn(
    () =>
      new Promise((resolve, reject) => {
        resolveSave = resolve
        rejectSave = reject
      })
  )

  beforeEach(() => {
    render(
      <SaveableForm save={save}>
        <input type="text" />
      </SaveableForm>
    )
  })

  describe("initially", () => {
    it("renders the save button in unchanged state", () => {
      expect(screen.getByRole("button")).toHaveTextContent(
        "Änderungen speichern"
      )
      expect(screen.getByRole("button")).toBeDisabled()
    })
  })

  describe("after changing the input", () => {
    beforeEach(async () => {
      await act(async () => userEvent.type(screen.getByRole("textbox"), "foo"))
    })

    it("renders the save button in changed state", () => {
      expect(screen.getByRole("button")).toHaveTextContent(
        "Änderungen speichern"
      )
      expect(screen.getByRole("button")).toBeEnabled()
    })

    describe("when clicking the save button", () => {
      beforeEach(async () => {
        await act(async () => screen.getByRole("button").click())
      })

      it("it calls the save function", () => {
        expect(save).toHaveBeenCalledTimes(1)
      })

      it("renders the save button first in saving state", () => {
        expect(screen.getByRole("button")).toHaveTextContent("Speichern ...")
        expect(screen.getByRole("button")).toBeDisabled()
      })

      describe("when saving succeeds", () => {
        it("renders the save button in succesfully-saved state", async () => {
          await act(async () => resolveSave())
          await waitFor(() => {
            expect(screen.getByRole("button")).toHaveTextContent("Gespeichert")
            expect(screen.getByRole("button")).toBeDisabled()
          })
        })
      })

      describe("when saving fails", () => {
        it("renders the save button in failure state", async () => {
          jest.spyOn(console, "error").mockImplementation(() => undefined)
          await act(async () => rejectSave("error"))
          await waitFor(() => {
            expect(screen.getByTitle("Fehler")).toBeInTheDocument()
            expect(screen.getByRole("button")).toBeEnabled()
          })
        })
      })
    })
  })
})
