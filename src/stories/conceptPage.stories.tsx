import React from "react"
import { decorator } from "../../.storybook/mocks/gatsby"
import ConceptPageTemplate from "../templates/conceptPage"
import {
  conceptPageWithAllOptionalContent,
  generalPageStaticQuery,
} from "../test-fixtures/content"

export default {
  title: "Pages/Concept Page",
  component: ConceptPageTemplate,
  decorators: [decorator],
  parameters: {
    chromatic: { disableSnapshot: false, viewports: [414, 1200] },
    staticQuery: generalPageStaticQuery(),
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
