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
        autoplaySpeed={5000}
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
            />
            <div
              dangerouslySetInnerHTML={{
                __html: sloganData.slogan.childMarkdownRemark.html,
              }}
              className="flex justify-center place-items-center text-xl xl:text-2xl px-32 py-8 text-center text-white absolute inset-0"
              style={{ textShadow: "1px 1px 4px rgba(0, 0, 0, 0.6)" }}
            />
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default Carousel
