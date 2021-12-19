import React from "react"
import YoutubeVideoComponent from "./YoutubeVideo"

export default {
  title: "Video/Youtube Video",
  component: YoutubeVideoComponent,
  parameters: {
    chromatic: { disableSnapot: false },
  },
}

export const YoutubeVideo = () => (
  <YoutubeVideoComponent url="https://www.youtube.com/watch?v=IdkCEioCp24" />
)
