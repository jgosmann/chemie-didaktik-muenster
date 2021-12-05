import React from "react"
import { ComponentStory } from "@storybook/react"

import CryptedEmail from "./Email"

export default {
  title: "Crypted/Email",
  component: CryptedEmail,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

const Template: ComponentStory<typeof CryptedEmail> = (args: {
  name: string
  domain: string
  tld: string
}) => <CryptedEmail {...args} />

export const Email = Template.bind({})
Email.args = { name: "name", domain: "domain", tld: "tld" }
