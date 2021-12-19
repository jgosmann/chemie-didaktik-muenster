import React from "react"
import { decorator } from "../../.storybook/mocks/gatsby"
import DetailsPageTemplate from "../templates/detailsPage"
import {
  allContentfulStartseite,
  conceptPageWithAllOptionalContent,
} from "../test-fixtures/content"
import { fileNode, youtubeThumbnail } from "../test-fixtures/images"
import { loremIpsum } from "../test-fixtures/richText"
import site from "../test-fixtures/site"
import { testVideoUrl } from "../test-fixtures/video"

export default {
  title: "Pages/Details Page",
  component: DetailsPageTemplate,
  decorators: [decorator],
  parameters: {
    chromatic: { disableSnapshot: false, viewports: [414, 1200, 1800] },
    staticQuery: {
      allContentfulStartseite: allContentfulStartseite(),
      site: site(),
    },
  },
}

export const DetailsPage = () => (
  <DetailsPageTemplate
    data={{
      parent: conceptPageWithAllOptionalContent({
        id: "concept-page",
        title: "Concept page",
      }),
      contentfulDetailsPage: {
        title: "Details Page",
        crumbs: [
          { title: "Startseite", slug: "" },
          { title: "Concept page", slug: "concept-page" },
          { title: "Details Page", slug: "details-page" },
        ],
        video: testVideoUrl,
        videoThumb: fileNode(youtubeThumbnail({ width: 640, height: 480 })),
        description: loremIpsum(),
      },
    }}
  />
)
