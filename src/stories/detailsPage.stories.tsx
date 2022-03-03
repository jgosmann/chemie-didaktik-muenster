import React from "react"
import { gatsbyDecorator } from "../../.storybook/mocks/gatsby"
import DetailsPageTemplate from "../templates/detailsPage"
import {
  conceptPageWithAllOptionalContent,
  generalPageStaticQuery,
} from "../test-fixtures/content"
import { fileNode, youtubeThumbnail } from "../test-fixtures/images"
import { loremIpsum } from "../test-fixtures/richText"
import { testVideoId } from "../test-fixtures/video"
import StaticLayoutDecorator from "./StaticLayoutDecorator"

export default {
  title: "Pages/Details Page",
  component: DetailsPageTemplate,
  decorators: [StaticLayoutDecorator, gatsbyDecorator],
  parameters: {
    chromatic: { disableSnapshot: false, viewports: [414, 1200, 1800] },
    staticQuery: generalPageStaticQuery(),
    layout: "fullscreen",
  },
}

const data = {
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
    video0: {
      videos: [
        {
          youtubeId: testVideoId,
          title: "TestVideo",
          thumb: fileNode(youtubeThumbnail({ width: 640, height: 480 })),
        },
      ],
    },
    description: loremIpsum(),
  },
}

export const DetailsPage = () => <DetailsPageTemplate data={data} />

export const DetailsPageWithMultipleVideos = () => (
  <DetailsPageTemplate
    data={{
      ...data,
      contentfulDetailsPage: {
        ...data.contentfulDetailsPage,
        video0: {
          videos: [
            ...data.contentfulDetailsPage.video0.videos,
            {
              youtubeId: testVideoId,
              title: "Second test video",
              thumb: fileNode(youtubeThumbnail({ width: 640, height: 480 })),
            },
          ],
        },
      },
    }}
  />
)
