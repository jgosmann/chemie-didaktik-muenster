import * as React from "react"
import Slider from "react-slick"

import "../styles/slick.min.css"
import "../styles/slick-theme.css"
import { graphql, useStaticQuery } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

interface SlideProps {
  children: React.ReactNode
  className?: string
}

const Carousel = () => {
  const slogans = useStaticQuery(graphql`
    query SlogansQuery {
      allContentfulSlogan {
        nodes {
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
      }
    }
  `).allContentfulSlogan.nodes

  return (
    <Slider
      autoplay
      autoplaySpeed={5000}
      dots
      className="rounded shadow overflow-hidden my-8"
      style={{ fontSize: 0 }}
    >
      {slogans.map(sloganData => (
        <div key={sloganData.id} className="h-64 relative">
          <GatsbyImage
            image={sloganData.image.gatsbyImageData}
            alt={""}
            className="absolute inset-0"
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
