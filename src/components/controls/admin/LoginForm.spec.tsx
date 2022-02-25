import React from "react"
import { render, screen } from "@testing-library/react"
import LoginForm from "./LoginForm"
import userEvent from "@testing-library/user-event"

describe("LoginForm", () => {
  const onSubmit = jest.fn()

  beforeEach(() => {
    onSubmit.mockReset()
  })

  describe("when the filled form is submitted", () => {
    it("calls the onSubmit callback", () => {
      render(<LoginForm onSubmit={onSubmit} />)
      userEvent.type(screen.getByLabelText("Benutzername"), "username")
      userEvent.type(screen.getByLabelText("Passwort"), "password")
      screen.getByRole("button").click()
      expect(onSubmit).toHaveBeenLastCalledWith("username", "password")
    })
  })

  describe("when the username is missing", () => {
    it("dose not call the onSubmit callback", () => {
      render(<LoginForm onSubmit={onSubmit} />)
      userEvent.type(screen.getByLabelText("Passwort"), "password")
      screen.getByRole("button").click()
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  describe("when the password is missing", () => {
    it("dose not call the onSubmit callback", () => {
      render(<LoginForm onSubmit={onSubmit} />)
      userEvent.type(screen.getByLabelText("Benutzername"), "username")
      screen.getByRole("button").click()
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })
})
