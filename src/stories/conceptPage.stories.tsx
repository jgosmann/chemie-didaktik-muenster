import React from "react"
import { decorator } from "../../.storybook/mocks/gatsby"
import ConceptPageTemplate from "../templates/conceptPage"
import {
  allContentfulStartseite,
  conceptPageWithAllOptionalContent,
} from "../test-fixtures/content"
import site from "../test-fixtures/site"

export default {
  title: "Pages/Concept Page",
  component: ConceptPageTemplate,
  decorators: [decorator],
  parameters: {
    chromatic: { disableSnapshot: false, viewports: [414, 1200] },
    staticQuery: {
      allContentfulStartseite: allContentfulStartseite(),
      site: site(),
    },
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
