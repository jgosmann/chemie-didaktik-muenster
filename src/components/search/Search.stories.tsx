import { ComponentStory } from "@storybook/react"
import React from "react"
import Search, { SearchProps } from "./Search"
import { searchData } from "../../test-fixtures/search"

export default {
  title: "Search/Search",
  component: Search,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

const Template: ComponentStory<typeof Search> = (args: SearchProps) => (
  <Search {...args} />
)

export const EmptySearch = Template.bind({})
EmptySearch.args = {
  query: "",
  searchData,
}

export const SuccesfullSearch = Template.bind({})
SuccesfullSearch.args = {
  ...EmptySearch.args,
  query: "ipsum",
}
