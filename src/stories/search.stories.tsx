import React from "react"
import { gatsbyDecorator } from "../../.storybook/mocks/gatsby"
import LocationContext from "../components/LocationContext"
import SearchPage from "../pages/search"
import { generalPageStaticQuery } from "../test-fixtures/content"
import { searchData } from "../test-fixtures/search"
import StaticLayoutDecorator from "./StaticLayoutDecorator"

export default {
  title: "Pages/Search",
  component: SearchPage,
  decorators: [StaticLayoutDecorator, gatsbyDecorator],
  parameters: {
    chromatic: { disableSnapshot: false },
    staticQuery: {
      ...generalPageStaticQuery(),
      localSearchPages: searchData,
    },
    layout: "fullscreen",
  },
}

export const Search = () => (
  <LocationContext.Provider
    value={{ pathname: "pathname", hash: "", search: "?q=ipsum" }}
  >
    <SearchPage />
  </LocationContext.Provider>
)
