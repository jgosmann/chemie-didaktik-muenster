import React from "react"
import { ComponentStory } from "@storybook/react"

import Card, { CardProps } from "./Card"

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
    url: "https://www.youtube.com/watch?v=IdkCEioCp24",
    thumb: {
      layout: "fixed",
      width: 256,
      height: 160,
      images: {
        fallback: {
          src: "https://img.youtube.com/vi/IdkCEioCp24/default.jpg",
        },
      },
    },
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
