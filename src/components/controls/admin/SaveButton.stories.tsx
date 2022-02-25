import { ComponentStory } from "@storybook/react"
import React from "react"
import SaveButton, { SaveButtonProps, State } from "./SaveButton"

export default {
  title: "Controls/Admin/Save Button",
  component: SaveButton,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

const Template: ComponentStory<typeof SaveButton> = (args: SaveButtonProps) => (
  <SaveButton {...args} />
)

export const Unchanged = Template.bind({})
Unchanged.args = {
  state: State.Unchanged,
}

export const Changed = Template.bind({})
Changed.args = {
  state: State.Changed,
}

export const Saving = Template.bind({})
Saving.args = {
  state: State.Saving,
}

export const SavedSuccesfully = Template.bind({})
SavedSuccesfully.args = {
  state: State.SavedSuccesfully,
}

export const Failure = Template.bind({})
Failure.args = {
  state: State.Failure,
}

export const Disabled = Template.bind({})
Disabled.args = {
  state: State.Changed,
  disabled: true,
}
