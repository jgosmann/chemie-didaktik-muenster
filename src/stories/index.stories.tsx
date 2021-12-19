import React from "react"
import IndexPage from "../pages"
import { decorator } from "../../.storybook/mocks/gatsby"
import { allContentfulStartseite } from "../test-fixtures/content"
import site from "../test-fixtures/site"

export default {
  title: "Pages/Index",
  component: IndexPage,
  decorators: [decorator],
  parameters: {
    chromatic: { disableSnapshot: false },
    staticQuery: {
      allContentfulStartseite: allContentfulStartseite(),
      site: site(),
    },
  },
}

export const Index = () => <IndexPage />
