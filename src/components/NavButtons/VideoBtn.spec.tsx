import React from "react"
import { render, screen } from "@testing-library/react"

import VideoBtn from "./VideoBtn"

jest.mock("../youtubeVideo")

describe("VideoBtn", () => {
  beforeEach(() => {
    render(
      <VideoBtn videoUrl="https://www.youtube.com/watch?v=IdkCEioCp24">
        Open video
      </VideoBtn>
    )
  })

  describe("initially", () => {
    it("does not show the consent popup", () => {
      expect(
        screen.getByText(text =>
          text.startsWith("Dieser Inhalt wird von einem Drittanbieter")
        )
      ).not.toBeVisible
    })

    it("does not render the video", () => {
      expect(screen.queryByTitle("YouTube video player")).not.toBeInTheDocument
    })
  })

  describe("when clicking the button for the first time", () => {
    beforeEach(() => {
      screen.getByText("Open video").click()
    })

    it("shows the consent popup", () => {
      expect(
        screen.getByText(text =>
          text.startsWith("Dieser Inhalt wird von einem Drittanbieter")
        )
      ).toBeVisible
    })

    it("does not render the video", () => {
      expect(screen.queryByTitle("YouTube video player")).not.toBeInTheDocument
    })

    describe("if consent is given", () => {
      beforeEach(() => {
        screen.getByText("Den Inhalt anzeigen").click()
      })

      it("does not show the consent popup", () => {
        expect(
          screen.queryByText(text =>
            text.startsWith("Dieser Inhalt wird von einem Drittanbieter")
          )
        ).not.toBeVisible
      })

      it("shows the video", async () => {
        expect(screen.getByTitle("YouTube video player")).toBeVisible
      })
    })

    describe("if consent is denied", () => {
      it("shows the consent popup", () => {
        expect(
          screen.getByText(text =>
            text.startsWith("Dieser Inhalt wird von einem Drittanbieter")
          )
        ).toBeVisible
      })

      it("does not render the video", () => {
        expect(screen.queryByTitle("YouTube video player")).not
          .toBeInTheDocument
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
      expect(
        screen.queryByText(text =>
          text.startsWith("Dieser Inhalt wird von einem Drittanbieter")
        )
      ).not.toBeVisible
    })

    it("shows the video", async () => {
      expect(screen.getByTitle("YouTube video player")).toBeVisible
    })
  })
})
