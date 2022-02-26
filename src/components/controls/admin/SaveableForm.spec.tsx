import React from "react"
import { render, screen, act, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import SaveableForm from "./SaveableForm"

describe("SaveableForm", () => {
  let resolveSave, rejectSave
  let save
  const onChange = jest.fn()
  const onSaveSucceeded = jest.fn()
  const formatError = jest.fn()

  beforeEach(() => {
    save = jest.fn(
      () =>
        new Promise<void>((resolve, reject) => {
          resolveSave = resolve
          rejectSave = reject
        })
    )
    onChange.mockReset()
    formatError.mockClear()
    render(
      <SaveableForm
        save={save}
        onChange={onChange}
        onSaveSucceeded={onSaveSucceeded}
        formatError={formatError}
      >
        <input type="text" required />
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

    it("calls onChange on changes", () => {
      userEvent.type(screen.getByRole("textbox"), "a")
      expect(onChange).toHaveBeenCalled()
    })
  })

  describe("with invalid input", () => {
    describe("when clicking the save button", () => {
      beforeEach(async () => {
        await act(async () => screen.getByRole("button").click())
      })

      it("does NOT call the save function", () => {
        expect(save).not.toHaveBeenCalled()
      })
    })
  })

  describe("after entering valid input", () => {
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
        beforeEach(async () => {
          await act(async () => resolveSave())
        })
        it("renders the save button in succesfully-saved state", async () => {
          await waitFor(() => {
            expect(screen.getByRole("button")).toHaveTextContent("Gespeichert")
            expect(screen.getByRole("button")).toBeDisabled()
          })
        })

        it("calls the onSaveSucceeded callback", async () => {
          await waitFor(() => {
            expect(onSaveSucceeded).toHaveBeenCalled()
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

        it("uses the formatError to format the error message", async () => {
          jest.spyOn(console, "error").mockImplementation(() => undefined)
          formatError.mockImplementation(() => "custom error")
          await act(async () => rejectSave("error"))
          await waitFor(() => {
            expect(formatError).toHaveBeenCalledWith("error")
            expect(screen.getByText("custom error")).toBeInTheDocument()
          })
        })
      })
    })
  })
})
