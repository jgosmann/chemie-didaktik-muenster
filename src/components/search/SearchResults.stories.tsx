import React from "react"
import SearchResults from "./SearchResults"

export default {
  title: "Search/Search Results",
  component: SearchResults,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

export const NoResults = () => <SearchResults results={[]} />

export const SomeResults = () => (
  <SearchResults
    results={[
      {
        id: "result0",
        crumbs: [
          { title: "Startseite", slug: "" },
          { title: "Result", slug: "result" },
        ],
        title: "Result",
      },
      {
        id: "result1",
        crumbs: [
          { title: "Startseite", slug: "" },
          { title: "Subpage", slug: "subpage" },
          { title: "Another result", slug: "another-result" },
        ],
        title: "Another result",
      },
    ]}
  />
)
