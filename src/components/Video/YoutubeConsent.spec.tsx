import React from "react"
import { render, screen } from "@testing-library/react"
import YoutubeConsent, { YoutubeConsentPopup } from "./YoutubeConsent"

describe("YoutubeConsentPopup", () => {
  const onConsentDenied = jest.fn()
  const onConsentGiven = jest.fn()

  beforeEach(() => {
    onConsentDenied.mockReset()
    onConsentGiven.mockReset()
    render(
      <YoutubeConsentPopup
        onConsentGiven={onConsentGiven}
        onConsentDenied={onConsentDenied}
      />
    )
  })

  it("does not pre-check the persist checkbox", () => {
    expect(
      screen.getByLabelText(
        "Diese Entscheidung bis zum Schließen des Browsers speichern."
      )
    ).not.toBeChecked()
  })

  describe("when denying consent", () => {
    it("calls the onConsentDenied callback", () => {
      screen.getByText("Abbrechen").click()
      expect(onConsentDenied).toHaveBeenCalled()
      expect(onConsentGiven).not.toHaveBeenCalled()
    })
  })

  describe("when giving consent", () => {
    describe("and the persist checkbox is not selected", () => {
      it("calls the onConsentGivenCallback with `persist: false`", () => {
        screen.getByText("Den Inhalt anzeigen").click()
        expect(onConsentGiven).toHaveBeenCalledWith({ persist: false })
        expect(onConsentDenied).not.toHaveBeenCalled()
      })
    })

    describe("and the persist checkbox is selected", () => {
      beforeEach(() => {
        screen
          .getByLabelText(
            "Diese Entscheidung bis zum Schließen des Browsers speichern."
          )
          .click()
      })

      it("calls the onConsentGivenCallback with `persist: false`", () => {
        screen.getByText("Den Inhalt anzeigen").click()
        expect(onConsentGiven).toHaveBeenCalledWith({ persist: true })
        expect(onConsentDenied).not.toHaveBeenCalled()
      })
    })
  })
})

describe("YoutubeConsent", () => {
  const onConsentDenied = jest.fn()
  const onConsentGiven = jest.fn()

  beforeEach(() => {
    onConsentDenied.mockReset()
    onConsentGiven.mockReset()
    render(
      <YoutubeConsent
        onConsentGiven={onConsentGiven}
        onConsentDenied={onConsentDenied}
      />
    )
  })

  describe("when denying consent", () => {
    it("calls the onConsentDenied callback", () => {
      screen.getByText("Abbrechen").click()
      expect(onConsentDenied).toHaveBeenCalledTimes(1)
      expect(onConsentGiven).not.toHaveBeenCalled()
    })
  })

  describe("when giving consent", () => {
    it("calls the onConsentDenied callback", () => {
      screen.getByText("Den Inhalt anzeigen").click()
      expect(onConsentGiven).toHaveBeenCalledTimes(1)
      expect(onConsentDenied).not.toHaveBeenCalled()
    })
  })

  describe("when given consent was persisted", () => {
    beforeEach(() => {
      screen
        .getByLabelText(
          "Diese Entscheidung bis zum Schließen des Browsers speichern."
        )
        .click()
      screen.getByText("Den Inhalt anzeigen").click()
    })

    it("calls the onConsentGiven on mount", () => {
      const secondOnConsentCallback = jest.fn(() => undefined)
      render(<YoutubeConsent onConsentGiven={secondOnConsentCallback} />)
      expect(secondOnConsentCallback).toHaveBeenCalledTimes(1)
    })
  })
})
