import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import * as React from "react"

export interface CardProps {
  title: React.ReactNode
  children: React.ReactNode
  download?: string
  link?: string
}

const Card = ({ title, children, download, link }: CardProps) => (
  <div className="rounded shadow w-64 flex flex-col">
    <h4 className="text-primary-700 m-2">{title}</h4>
    <StaticImage
      src="../images/thumb-placeholder.png"
      alt="video"
      className="w-full shadow"
    />
    <div className="prose leading-snug text-sm m-2 flex-grow">{children}</div>
    <div className="flex flex-row flex-wrap justify-between m-2 mt-2">
      <div>{download && <a href={download}>Download</a>}</div>
      <div>
        <Link to={link || "/page-2"} className="text-">
          Alle Infos {">>"}
        </Link>
      </div>
    </div>
  </div>
)

export default Card
