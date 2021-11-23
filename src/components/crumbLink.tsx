import { Link } from "gatsby"
import * as React from "react"

export interface Crumb {
  slug: string
}

export interface CrumbLinkProps {
  crumbs: Crumb[]
  children: React.ReactNode
  className?: string
}

const CrumbLink = ({
  crumbs,
  children,
  className,
}: CrumbLinkProps): JSX.Element => (
  <Link to={crumbs.map(({ slug }) => slug).join("/")} className={className}>
    {children}
  </Link>
)

export default CrumbLink
