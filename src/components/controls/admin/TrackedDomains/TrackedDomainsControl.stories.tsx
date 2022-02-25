import React from "react"
import { ComponentStory } from "@storybook/react"
import TrackedDomainsControl, {
  TrackedDomainsControlProps,
} from "./TrackedDomainsControl"

export default {
  title: "Controls/Admin/Tracked Domains",
  component: TrackedDomainsControl,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

const Template: ComponentStory<typeof TrackedDomainsControl> = (
  args: TrackedDomainsControlProps
) => <TrackedDomainsControl {...args} />

export const WithoutDomains = Template.bind({})
WithoutDomains.args = {
  initialTrackedDomains: [],
}

export const WithDomains = Template.bind({})
WithDomains.args = {
  initialTrackedDomains: ["example.org", "foo.com"],
}
