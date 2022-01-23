import React from "react"
import { ComponentStory } from "@storybook/react"
import SearchInput, { SearchInputProps } from "./SearchInput"

export default {
  title: "Search/Search Input",
  component: SearchInput,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

const Template: ComponentStory<typeof SearchInput> = (
  args: SearchInputProps
) => <SearchInput {...args} />

export const Empty = Template.bind({})

export const NonEmpty = Template.bind({})
NonEmpty.args = {
  value: "Some value",
}
