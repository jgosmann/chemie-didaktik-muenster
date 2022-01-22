import React from "react"
import { gatsbyDecorator } from "../../.storybook/mocks/gatsby"
import BasicPageTemplate from "../templates/basicPage"
import { generalPageStaticQuery } from "../test-fixtures/content"
import { loremIpsum } from "../test-fixtures/richText"
import StaticLayoutDecorator from "./StaticLayoutDecorator"

export default {
  title: "Pages/Basic Page",
  component: BasicPageTemplate,
  decorators: [StaticLayoutDecorator, gatsbyDecorator],
  parameters: {
    chromatic: { disableSnapshot: false },
    staticQuery: generalPageStaticQuery(),
    layout: "fullscreen",
  },
}

export const BasicPage = () => (
  <BasicPageTemplate
    data={{
      contentfulBasicPage: {
        title: "Basic page",
        crumbs: [
          { title: "Startseite", slug: "" },
          { title: "Basic page", slug: "basic-page" },
        ],
        collapse: false,
        content: loremIpsum(),
      },
    }}
    pageContext={{}}
  />
)
