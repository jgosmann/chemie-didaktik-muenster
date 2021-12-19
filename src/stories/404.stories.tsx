import React from "react"
import NotFoundPage from "../pages/404"
import { decorator } from "../../.storybook/mocks/gatsby"
import { allContentfulStartseite } from "../test-fixtures/content"
import site from "../test-fixtures/site"

export default {
  title: "Pages/Not Found",
  component: NotFoundPage,
  decorators: [decorator],
  parameters: {
    chromatic: { disableSnapshot: false },
    staticQuery: {
      allContentfulStartseite: allContentfulStartseite(),
      site: site(),
    },
  },
}

export const NotFound = () => <NotFoundPage />
