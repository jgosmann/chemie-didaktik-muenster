import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import * as React from "react"

export interface CardProps {
  title: React.ReactNode
  children: React.ReactNode
}

const Card = ({ title, children }: CardProps) => (
  <div className="rounded shadow w-64 flex flex-col">
    <h4 className="text-primary-700 m-2">{title}</h4>
    <StaticImage
      src="../images/thumb-placeholder.png"
      alt="video"
      className="w-full shadow"
    />
    <div className="prose leading-snug text-sm m-2 flex-grow">{children}</div>
    <div className="text-right m-2 mt-4 text-secondary-800">
      <Link to="/page-2" className="text-">
        Alle Infos {">>"}
      </Link>
    </div>
  </div>
)

export default Card
