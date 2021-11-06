import * as React from "react"
import Slider from "react-slick"

import "../styles/slick.min.css"
import "../styles/slick-theme.css"
import { graphql, useStaticQuery } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

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

const Carousel = ({ slogans }) => {
  return (
    <Slider
      autoplay
      autoplaySpeed={5000}
      dots
      className="rounded shadow overflow-hidden my-8"
      style={{ fontSize: 0 }}
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
  )
}

export default Carousel
