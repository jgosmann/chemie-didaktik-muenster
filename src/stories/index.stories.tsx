import React from "react"
import IndexPage from "../pages"
import { gatsbyDecorator } from "../../.storybook/mocks/gatsby"
import { generalPageStaticQuery } from "../test-fixtures/content"
import StaticLayoutDecorator from "./StaticLayoutDecorator"

export default {
  title: "Pages/Index",
  component: IndexPage,
  decorators: [StaticLayoutDecorator, gatsbyDecorator],
  parameters: {
    chromatic: { disableSnapshot: false },
    staticQuery: generalPageStaticQuery(),
    layout: "fullscreen",
  },
}

export const Index = () => <IndexPage />
