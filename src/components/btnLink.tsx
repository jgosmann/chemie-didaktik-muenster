import * as React from "react"
import { Link } from "gatsby"

export interface BtnLinkProps {
  children: React.ReactNode
  to?: string
}

const BtnLink = ({ to, children }: BtnLinkProps) => (
  <Link to={to} className="btn">
    {children}
  </Link>
)

export default BtnLink
