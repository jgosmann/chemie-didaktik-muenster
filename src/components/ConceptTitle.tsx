import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"
import * as React from "react"

export interface ConceptTitleProps {
  titleImage?: {
    gatsbyImageData: IGatsbyImageData
  }
  title: string
}

const ConceptTitle = ({
  titleImage,
  title,
}: ConceptTitleProps): JSX.Element => {
  if (titleImage) {
    return (
      <GatsbyImage
        image={titleImage.gatsbyImageData}
        alt={title}
        className="no-image-transition"
      />
    )
  }
  return <>{title}</>
}

export default ConceptTitle
