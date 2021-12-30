import React from "react"
import { decorator } from "../../.storybook/mocks/gatsby"
import BasicPageTemplate from "../templates/basicPage"
import { generalPageStaticQuery } from "../test-fixtures/content"
import { loremIpsum } from "../test-fixtures/richText"

export default {
  title: "Pages/Basic Page",
  component: BasicPageTemplate,
  decorators: [decorator],
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
        content: loremIpsum(),
      },
    }}
    pageContext={{}}
  />
)
