import React from "react"
import { render, screen } from "@testing-library/react"

import VideoBtn from "./VideoBtn"
import { testVideoUrl } from "../../test-fixtures/video"

jest.mock("../Video/YoutubeVideo")

describe("VideoBtn", () => {
  const consentPopup = () =>
    screen.queryByText(text =>
      text.startsWith("Dieser Inhalt wird von einem Drittanbieter")
    )
  const videoPlayer = () => screen.queryByTitle("YouTube video player")

  beforeEach(() => {
    render(<VideoBtn videoUrl={testVideoUrl}>Open video</VideoBtn>)
  })

  describe("initially", () => {
    it("does not show the consent popup", () => {
      expect(consentPopup()).not.toBeVisible()
    })

    it("does not render the video", () => {
      expect(videoPlayer()).not.toBeInTheDocument()
    })
  })

  describe("when clicking the button for the first time", () => {
    beforeEach(() => {
      screen.getByText("Open video").click()
    })

    it("shows the consent popup", () => {
      expect(consentPopup()).toBeVisible()
    })

    it("does not render the video", () => {
      expect(videoPlayer()).not.toBeInTheDocument()
    })

    describe("if consent is given", () => {
      beforeEach(() => {
        screen.getByText("Den Inhalt anzeigen").click()
      })

      it("does not show the consent popup", () => {
        expect(consentPopup()).not.toBeInTheDocument()
      })

      it("shows the video", async () => {
        expect(videoPlayer()).toBeVisible
      })
    })

    describe("if consent is denied", () => {
      it("shows the consent popup", () => {
        expect(consentPopup()).toBeVisible()
      })

      it("does not render the video", () => {
        expect(videoPlayer()).not.toBeInTheDocument()
      })
    })
  })

  describe("when clicking the button and consent is already given", () => {
    beforeEach(() => {
      screen.getByText("Open video").click()
      screen.getByText("Den Inhalt anzeigen").click()
      screen.getByTitle("Schließen").click()
      screen.getByText("Open video").click()
    })

    it("does not show the consent popup", () => {
      expect(consentPopup()).not.toBeInTheDocument()
    })

    it("shows the video", async () => {
      expect(videoPlayer()).toBeVisible()
    })
  })
})
