import { Link } from "gatsby"
import React from "react"
import Message, { Type } from "../Message"
import { Breadcrumb } from "../navigation/Breadcrumbs"

export interface SearchResultsProps {
  results: Array<{
    id: string
    crumbs: Breadcrumb[]
    title: string
  }>
}

const SearchResults = ({ results }: SearchResultsProps) =>
  results.length == 0 ? (
    <Message type={Type.Info} className="text-xl">
      Leider wurde kein passender Inhalt gefunden.
    </Message>
  ) : (
    <ul>
      {results.map(result => (
        <li key={result.id} className="mt-6 shadow border rounded p-4">
          <ol className="breadcrumbs text-sm text-gray-600">
            {result.crumbs.slice(0, -1).map((c, i) => (
              <li key={i} className="inline">
                {c.title}
              </li>
            ))}
          </ol>
          <Link
            to={result.crumbs.map(c => c.slug).join("/")}
            className="text-xl"
          >
            {result.title}
          </Link>
        </li>
      ))}
    </ul>
  )

export default SearchResults
