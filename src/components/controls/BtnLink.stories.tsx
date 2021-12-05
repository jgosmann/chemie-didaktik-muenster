import React from "react"
import { Story } from "@storybook/react"

import BtnLinkComponent from "./BtnLink"

export default {
  title: "Controls/Button Link",
  component: BtnLinkComponent,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

interface Args {
  label: string
}

const Template: Story<Args> = ({ label }: Args) => (
  <BtnLinkComponent to="/">{label}</BtnLinkComponent>
)

export const ButtonLink = Template.bind({})
ButtonLink.args = {
  label: "Label",
}
