import { Link } from "gatsby"
import * as React from "react"

export interface Breadcrumb {
  title: string
  slug: string
}

export interface BreadcrumbsProps {
  crumbs: Breadcrumb[]
}

const Breadcrumbs = ({ crumbs }: BreadcrumbsProps) => {
  const absolutePathCrumbs = crumbs.reduce(
    (prev, current) => [
      ...prev,
      {
        title: current.title,
        absPath: `${prev.length > 0 ? prev[prev.length - 1].absPath : ""}${
          current.slug
        }/`,
      },
    ],
    []
  )
  return (
    <nav className="text-sm font-normal text-gray-600">
      Sie sind hier:{" "}
      {absolutePathCrumbs.map((crumb, i) => {
        if (i < absolutePathCrumbs.length - 1) {
          return (
            <>
              <Link to={crumb.absPath}>{crumb.title}</Link> /{" "}
            </>
          )
        } else {
          return crumb.title
        }
      })}
    </nav>
  )
}

export default Breadcrumbs
