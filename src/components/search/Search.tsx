import React from "react"
import { useFlexSearch } from "react-use-flexsearch"
import SearchInput from "./SearchInput"
import SearchResults from "./SearchResults"

export interface SearchProps {
  query?: string
  onQueryChange?: (query: string) => void
  searchData: {
    index: string
    store: object
  }
}

const Search = ({ query, onQueryChange, searchData }: SearchProps) => {
  const results = useFlexSearch(query, searchData.index, searchData.store)
  return (
    <>
      <form
        action=""
        method="get"
        className="grid grid-cols-2 gap-2 items-baseline"
        style={{ gridTemplateColumns: "max-content minmax(auto, 20rem)" }}
      >
        <label htmlFor="q">Suchbegriff:</label>
        <SearchInput value={query} onQueryChange={onQueryChange} />
      </form>
      {query && <SearchResults results={results} />}
    </>
  )
}

export default Search
