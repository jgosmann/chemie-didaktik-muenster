import React from "react"
import { testVideoUrl } from "../../test-fixtures/video"
import YoutubeVideoComponent from "./YoutubeVideo"

export default {
  title: "Video/Youtube Video",
  component: YoutubeVideoComponent,
  parameters: {
    chromatic: { disableSnapot: false },
  },
}

export const YoutubeVideo = () => <YoutubeVideoComponent url={testVideoUrl} />
