import {
  faAngleDoubleRight,
  faDownload,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { graphql, Link } from "gatsby"
import { ImageDataLike } from "gatsby-plugin-image"
import * as React from "react"
import Video from "./Video"

export const query = graphql`
  fragment CardVideoThumbFragment on ImageSharp {
    gatsbyImageData(layout: FIXED, width: 256, height: 160)
  }
`

export interface CardProps {
  title: React.ReactNode
  children: React.ReactNode
  download?: string
  link: string
  video?: {
    url: string
    thumb: ImageDataLike
  }
}

const Card = ({ title, video, children, download, link }: CardProps) => (
  <div className="rounded shadow w-64 flex flex-col">
    <h4 className="text-primary m-2">{title}</h4>
    {video && (
      <Video url={video.url} thumb={video.thumb} width="256" height="160" />
    )}
    <div className="prose leading-snug text-sm m-2 flex-grow">{children}</div>
    <div className="flex flex-row flex-wrap justify-between m-2 mt-2">
      <div>
        {download && (
          <a href={download}>
            <FontAwesomeIcon icon={faDownload} className="mr-1" />
            Download
          </a>
        )}
      </div>
      <div>
        <Link to={link} className="text-">
          Alle Infos
          <FontAwesomeIcon icon={faAngleDoubleRight} className="ml-1 " />
        </Link>
      </div>
    </div>
  </div>
)

export default Card
