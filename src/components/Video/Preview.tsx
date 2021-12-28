import { faPlay } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"
import React from "react"

export interface PreviewProps {
  onClick?: () => void
  className?: string
  thumbImage?: IGatsbyImageData
}

const Preview = ({ onClick, className, thumbImage }: PreviewProps) => (
  <button
    onClick={onClick}
    className={`block relative max-w-full max-h-screen overflow-hidden ${className}`}
  >
    {thumbImage && <GatsbyImage image={thumbImage} alt="Video thumbnail" />}
    <div className="block rounded-md border-2 border-gray-100 hover:border-primary w-12 h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-lg text-gray-100 bg-black hover:text-primary">
      <FontAwesomeIcon
        icon={faPlay}
        size="2x"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  </button>
)

export default Preview
