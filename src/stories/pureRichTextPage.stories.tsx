import React from "react"
import { gatsbyDecorator } from "../../.storybook/mocks/gatsby"
import PureRichTextPageTemplate from "../templates/pureRichTextPage"
import { generalPageStaticQuery } from "../test-fixtures/content"
import { loremIpsum } from "../test-fixtures/richText"
import StaticLayoutDecorator from "./StaticLayoutDecorator"

export default {
  title: "Pages/Pure Rich Text Page",
  component: PureRichTextPageTemplate,
  decorators: [StaticLayoutDecorator, gatsbyDecorator],
  parameters: {
    chromatic: { disableSnapshot: false },
    staticQuery: generalPageStaticQuery(),
    layout: "fullscreen",
  },
}

export const PureRichTextPage = () => (
  <PureRichTextPageTemplate
    pageContext={{
      title: "Pure Rich Text Page",
      crumbs: [
        { title: "Startseite", slug: "" },
        { title: "Pure Rich Text Page", slug: "pure-rich-text-page" },
      ],
      content: loremIpsum(),
    }}
  />
)
