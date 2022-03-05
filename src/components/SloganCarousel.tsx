import * as React from "react"
import Slider from "react-slick"

import "../styles/slick.min.css"
import "../styles/slick-theme.css"
import { graphql } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"

export interface SloganFragment {
  id: string
  slogan: {
    childMarkdownRemark: {
      html: string
    }
  }
  image: { gatsbyImageData: IGatsbyImageData }
}

export const query = graphql`
  fragment SloganFragment on ContentfulSlogan {
    id
    slogan {
      childMarkdownRemark {
        html
      }
    }
    image {
      gatsbyImageData(layout: FULL_WIDTH)
    }
  }
`

interface CarousalProps {
  slogans: SloganFragment[]
  autoplay?: boolean
}

const Carousel = ({ slogans, autoplay }: CarousalProps) => {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)")?.matches
  return (
    <div style={{ fontSize: 0 }}>
      <Slider
        autoplay={autoplay && !prefersReducedMotion}
        autoplaySpeed={10000}
        speed={prefersReducedMotion ? 0 : 300}
        dots
        className="rounded shadow overflow-hidden my-8"
      >
        {slogans.map(sloganData => (
          <div key={sloganData.id} className="h-64 relative overflow-hidden">
            <GatsbyImage
              image={sloganData.image.gatsbyImageData}
              alt={""}
              className="absolute inset-0 w-full h-full"
              style={{ transform: "translateZ(0px)" }}
            />
            <div
              dangerouslySetInnerHTML={{
                __html: sloganData.slogan.childMarkdownRemark.html,
              }}
              className="flex justify-center place-items-center text-xl xl:text-2xl px-32 py-8 text-center text-gray-800 absolute inset-0"
              style={{
                textShadow:
                  "0px 0px 2px #fff, 0px 0px 4px #fff, 0px 0px 8px #fff",
                transform: "translateZ(10px)",
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default Carousel
