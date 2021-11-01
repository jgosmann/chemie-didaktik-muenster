import * as React from "react"
import { Link } from "gatsby"

export interface BtnLinkProps {
  children: React.ReactNode
  to?: string
}

const BtnLink = ({ to, children }: BtnLinkProps) => (
  <Link
    to={to}
    className="w-44 min-w-max rounded-lg border p-3 flex justify-center place-items-center text-white hover:text-white active:text-white visited:text-white shadow bg-primary-400 hover:bg-primary-600 transition-colors ease-out hover:no-underline active:no-underline"
  >
    {children}
  </Link>
)

export default BtnLink
