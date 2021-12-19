import React from "react"
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
      {
        id: "id0",
        slogan: {
          childMarkdownRemark: {
            html: "<strong>Slogan</strong>: id 0",
          },
        },
        image: {
          gatsbyImageData: {
            layout: "fixed",
            width: 1920,
            height: 1080,
            images: {
              fallback: {
                src: "/fill-r.png",
              },
            },
          },
        },
      },
      {
        id: "id1",
        slogan: {
          childMarkdownRemark: {
            html: "<strong>Slogan</strong>: id 1",
          },
        },
        image: {
          gatsbyImageData: {
            layout: "fixed",
            width: 1920,
            height: 1080,
            images: {
              fallback: {
                src: "/fill-b.png",
              },
            },
          },
        },
      },
    ]}
  />
)
