import React from "react"
import { act, render, screen } from "@testing-library/react"
import Video from "."
import { testVideoId } from "../../test-fixtures/video"

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
        youtubeId={testVideoId}
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
      act(() => screen.getByRole("button").click())
    })

    it("shows the consent popup", () => {
      expect(consentPopup()).toBeVisible()
    })

    it("does not render the video", () => {
      expect(videoPlayer()).not.toBeInTheDocument()
    })

    describe("and then closing the consent popup", () => {
      beforeEach(() => {
        act(() => screen.getByTitle("Schließen").click())
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
        act(() => screen.getByText("Abbrechen").click())
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
        act(() => screen.getByText("Den Inhalt anzeigen").click())
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
