import React from "react"
import { gatsbyDecorator } from "../../.storybook/mocks/gatsby"
import ConceptPageTemplate from "../templates/conceptPage"
import {
  conceptPageWithAllOptionalContent,
  generalPageStaticQuery,
} from "../test-fixtures/content"
import StaticLayoutDecorator from "./StaticLayoutDecorator"

export default {
  title: "Pages/Concept Page",
  component: ConceptPageTemplate,
  decorators: [StaticLayoutDecorator, gatsbyDecorator],
  parameters: {
    chromatic: { disableSnapshot: false, viewports: [414, 1200] },
    staticQuery: generalPageStaticQuery(),
    layout: "fullscreen",
  },
}

export const ConceptPage = () => (
  <ConceptPageTemplate
    data={{
      contentfulConceptPage: conceptPageWithAllOptionalContent({
        id: "concept-page",
        title: "Concept page",
      }),
    }}
  />
)
