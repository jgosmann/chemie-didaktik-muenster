import React from "react"
import NotFoundPage from "../pages/404"
import { decorator } from "../../.storybook/mocks/gatsby"
import { generalPageStaticQuery } from "../test-fixtures/content"

export default {
  title: "Pages/Not Found",
  component: NotFoundPage,
  decorators: [decorator],
  parameters: {
    chromatic: { disableSnapshot: false },
    staticQuery: generalPageStaticQuery(),
  },
}

export const NotFound = () => <NotFoundPage />
