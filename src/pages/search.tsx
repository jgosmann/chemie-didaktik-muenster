import { graphql, useStaticQuery } from "gatsby"
import React from "react"
import Layout from "../components/layout"
import Search from "../components/search/Search"
import useUrlQueryParam from "../components/search/useUrlQueryParam"

interface LocalSearchPagesQuery {
  localSearchPages: {
    index: string
    store: object
  }
}

const SearchPage = () => {
  const { localSearchPages } = useStaticQuery<LocalSearchPagesQuery>(graphql`
    {
      localSearchPages {
        index
        store
      }
    }
  `)
  const [query, setQuery] = useUrlQueryParam()

  return (
    <Layout crumbs={[{ slug: "search", title: "Suche" }]}>
      <Search
        query={query}
        onQueryChange={setQuery}
        searchData={localSearchPages}
      />
    </Layout>
  )
}

export default SearchPage
