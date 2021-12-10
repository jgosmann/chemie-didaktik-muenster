import React from "react"
import { ComponentStory } from "@storybook/react"

import NavButtonsComponent, { NavButtonsProps } from "."
import NavButtons from "."

export default {
  title: "Navigation Buttons",
  component: NavButtonsComponent,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

const Template: ComponentStory<typeof NavButtonsComponent> = (
  args: NavButtonsProps
) => <NavButtons {...args} />

export const Minimal = Template.bind({})
Minimal.args = {
  baseSlug: "baseSlug",
  hasStudentPresentations: false,
  hasAdditionalBackground: false,
}

export const Full = Template.bind({})
Full.args = {
  ...Minimal.args,
  hasStudentPresentations: true,
  hasAdditionalBackground: true,
  aboutAuthorMedia: {
    aboutAuthorVideo: "https://www.youtube.com/watch?v=IdkCEioCp24",
    aboutAuthorPreview: {
      title: "title",
      gatsbyImageData: {
        layout: "fixed",
        width: 42,
        height: 42,
        images: {
          fallback: {
            src: "https://img.youtube.com/vi/IdkCEioCp24/default.jpg",
          },
        },
      },
    },
  },
}
