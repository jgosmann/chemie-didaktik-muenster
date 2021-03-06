import { Link } from "gatsby"
import * as React from "react"

export interface Breadcrumb {
  title: string
  slug: string
}

export interface BreadcrumbsProps {
  crumbs: Breadcrumb[]
}

interface AbsolutePathCrumb {
  title: string
  absPath: string
}

const Breadcrumbs = ({ crumbs }: BreadcrumbsProps) => {
  const absolutePathCrumbs = crumbs.reduce<AbsolutePathCrumb[]>(
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
  const liClasses = "inline"
  return (
    <nav className="text-sm font-normal text-gray-600">
      Sie sind hier:{" "}
      <ol className="inline breadcrumbs">
        {absolutePathCrumbs.map((crumb, i) => {
          if (i < absolutePathCrumbs.length - 1) {
            return (
              <li className={liClasses} key={i}>
                <Link to={crumb.absPath}>{crumb.title}</Link>
              </li>
            )
          } else {
            return (
              <li className={liClasses} key={i}>
                {crumb.title}
              </li>
            )
          }
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
