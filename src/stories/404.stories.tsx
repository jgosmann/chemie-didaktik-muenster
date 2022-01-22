import React from "react"
import NotFoundPage from "../pages/404"
import { gatsbyDecorator } from "../../.storybook/mocks/gatsby"
import { generalPageStaticQuery } from "../test-fixtures/content"
import StaticLayoutDecorator from "./StaticLayoutDecorator"

export default {
  title: "Pages/Not Found",
  component: NotFoundPage,
  decorators: [StaticLayoutDecorator, gatsbyDecorator],
  parameters: {
    chromatic: { disableSnapshot: false },
    staticQuery: generalPageStaticQuery(),
    layout: "fullscreen",
  },
}

export const NotFound = () => <NotFoundPage />
