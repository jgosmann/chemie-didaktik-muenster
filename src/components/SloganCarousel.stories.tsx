import React from "react"
import { slogan } from "../test-fixtures/content"
import SloganCarouselComponent from "./SloganCarousel"

export default {
  title: "Slogan Carousel",
  component: SloganCarouselComponent,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
}

export const SloganCarousel = () => (
  <SloganCarouselComponent
    slogans={[
      slogan({
        id: "slogan-0",
        html: "<strong>Slogan</strong>: id 0",
        fill: "r",
      }),
      slogan({
        id: "slogan1",
        html: "<strong>Slogan</strong>: id 1",
        fill: "b",
      }),
    ]}
  />
)
