import React from "react"
import IndexPage from "../pages"
import { decorator } from "../../.storybook/mocks/gatsby"
import { generalPageStaticQuery } from "../test-fixtures/content"

export default {
  title: "Pages/Index",
  component: IndexPage,
  decorators: [decorator],
  parameters: {
    chromatic: { disableSnapshot: false },
    staticQuery: generalPageStaticQuery(),
    layout: "fullscreen",
  },
}

export const Index = () => <IndexPage />
