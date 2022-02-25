import React from "react"
import { ComponentStory } from "@storybook/react"
import {
  TrackedDomainsView,
  TrackedDomainsViewProps,
} from "./TrackedDomainsControl"
import { State } from "./SaveButton"

export default {
  title: "Controls/Admin/Tracked Domains",
  component: TrackedDomainsView,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

const Template: ComponentStory<typeof TrackedDomainsView> = (
  args: TrackedDomainsViewProps
) => <TrackedDomainsView {...args} />

export const WithoutDomains = Template.bind({})
WithoutDomains.args = {
  trackedDomains: [],
  saveButtonState: State.Unchanged,
}

export const WithDomainsUnchanged = Template.bind({})
WithDomainsUnchanged.args = {
  trackedDomains: ["example.org", "foo.com"],
  saveButtonState: State.Unchanged,
}

export const WithDomainsChanged = Template.bind({})
WithDomainsChanged.args = {
  ...WithDomainsUnchanged.args,
  saveButtonState: State.Changed,
}

export const WithDomainsSaving = Template.bind({})
WithDomainsSaving.args = {
  ...WithDomainsUnchanged.args,
  saveButtonState: State.Saving,
}

export const WithDomainsSavedSuccessfully = Template.bind({})
WithDomainsSavedSuccessfully.args = {
  ...WithDomainsUnchanged.args,
  saveButtonState: State.SavedSuccesfully,
}

export const WithDomainsFailure = Template.bind({})
WithDomainsFailure.args = {
  ...WithDomainsUnchanged.args,
  saveButtonState: State.Failure,
}
