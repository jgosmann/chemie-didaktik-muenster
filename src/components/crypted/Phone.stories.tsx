import React from "react"
import { ComponentStory } from "@storybook/react"

import CryptedPhone from "./Phone"

export default {
  title: "Crypted/Phone",
  component: CryptedPhone,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

const Template: ComponentStory<typeof CryptedPhone> = (args: {
  country: string
  area: string
  block0: string
  block1: string
}) => <CryptedPhone {...args} />

export const Phone = Template.bind({})
Phone.args = { country: "+49", area: "174", block0: "123", block1: "4567" }
