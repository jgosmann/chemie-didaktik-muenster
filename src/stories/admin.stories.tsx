import React from "react"
import AdminPage from "../pages/admin"
import { gatsbyDecorator } from "../../.storybook/mocks/gatsby"
import { generalPageStaticQuery } from "../test-fixtures/content"
import StaticLayoutDecorator from "./StaticLayoutDecorator"

export default {
  title: "Pages/Admin",
  component: AdminPage,
  decorators: [StaticLayoutDecorator, gatsbyDecorator],
  parameters: {
    chromatic: { disableSnapshot: false },
    staticQuery: generalPageStaticQuery(),
    layout: "fullscreen",
  },
}

export const Admin = () => <AdminPage />
