import React from "react"
import { render, screen } from "@testing-library/react"
import Video from "."
import { testVideoUrl } from "../../test-fixtures/video"

jest.mock("./YoutubeVideo")

describe("Video", () => {
  const consentPopup = () =>
    screen.queryByText(text =>
      text.startsWith("Dieser Inhalt wird von einem Drittanbieter")
    )
  const videoPlayer = () => screen.queryByTitle("YouTube video player")

  beforeEach(() => {
    render(
      <Video
        url={testVideoUrl}
        thumb={{
          parent: "",
          children: [],
          internal: { type: "img", contentDigest: "", owner: "" },
          id: "image-id",
          gatsbyImageData: {
            layout: "fixed",
            width: 1,
            height: 1,
            images: { fallback: { src: "" } },
          },
        }}
      />
    )
  })

  describe("initially", () => {
    it("shows the preview", () => {
      expect(screen.getByAltText("Video thumbnail")).toBeInTheDocument()
    })

    it("does not show the consent popup", () => {
      expect(consentPopup()).not.toBeInTheDocument()
    })

    it("does not render the video", () => {
      expect(videoPlayer()).not.toBeInTheDocument()
    })
  })

  describe("when clicking the preview", () => {
    beforeEach(() => {
      screen.getByRole("button").click()
    })

    it("shows the consent popup", () => {
      expect(consentPopup()).toBeVisible()
    })

    it("does not render the video", () => {
      expect(videoPlayer()).not.toBeInTheDocument()
    })

    describe("and then closing the consent popup", () => {
      beforeEach(() => {
        screen.getByTitle("Schließen").click()
      })

      it("shows the preview", () => {
        expect(screen.getByAltText("Video thumbnail")).toBeInTheDocument()
      })

      it("does not show the consent popup", () => {
        expect(consentPopup()).not.toBeInTheDocument()
      })

      it("does not render the video", () => {
        expect(videoPlayer()).not.toBeInTheDocument()
      })
    })

    describe("and denying consent", () => {
      beforeEach(() => {
        screen.getByText("Abbrechen").click()
      })

      it("shows the preview", () => {
        expect(screen.getByAltText("Video thumbnail")).toBeInTheDocument()
      })

      it("does not show the consent popup", () => {
        expect(consentPopup()).not.toBeInTheDocument()
      })

      it("does not render the video", () => {
        expect(videoPlayer()).not.toBeInTheDocument()
      })
    })

    describe("and giving consent", () => {
      beforeEach(() => {
        screen.getByText("Den Inhalt anzeigen").click()
      })

      it("does not render the preview", () => {
        expect(screen.queryByAltText("Video thumbnail")).not.toBeInTheDocument()
      })

      it("does not show the consent popup", () => {
        expect(consentPopup()).not.toBeInTheDocument()
      })

      it("shows the video", () => {
        expect(videoPlayer()).toBeVisible()
      })
    })
  })
})
