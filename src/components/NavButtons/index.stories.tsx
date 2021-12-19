import React from "react"
import { ComponentStory } from "@storybook/react"

import NavButtonsComponent, { NavButtonsProps } from "."
import NavButtons from "."
import { testVideoUrl } from "../../test-fixtures/video"
import { youtubeThumbnail } from "../../test-fixtures/images"

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
    aboutAuthorVideo: testVideoUrl,
    aboutAuthorPreview: youtubeThumbnail({ width: 42, height: 42 }),
  },
}
