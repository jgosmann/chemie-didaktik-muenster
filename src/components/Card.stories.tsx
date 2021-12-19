import React from "react"
import { ComponentStory } from "@storybook/react"

import Card, { CardProps } from "./Card"
import { testVideoUrl } from "../test-fixtures/video"
import { youtubeThumbnail } from "../test-fixtures/images"

export default {
  title: "Card",
  component: Card,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

const Template: ComponentStory<typeof Card> = ({
  children,
  ...args
}: CardProps) => <Card {...args}>{children}</Card>

export const Minimal = Template.bind({})
Minimal.args = {
  children: "Description",
  title: "Title",
  link: "link",
}

export const WithPreview = Template.bind({})
WithPreview.args = {
  ...Minimal.args,
  video: {
    url: testVideoUrl,
    thumb: youtubeThumbnail(),
  },
}

export const WithDownload = Template.bind({})
WithDownload.args = {
  ...Minimal.args,
  download: "download",
}

export const Full = Template.bind({})
Full.args = {
  ...WithPreview.args,
  ...WithDownload.args,
}
