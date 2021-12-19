import { ComponentStory } from "@storybook/react"
import React from "react"
import { LayoutView, LayoutViewProps } from "."
import { decorator } from "../../../.storybook/mocks/gatsby"
import { allContentfulStartseite } from "../../test-fixtures/content"

export default {
  title: "Layout",
  component: LayoutView,
  decorators: [decorator],
  parameters: {
    chromatic: { disableSnapshot: false, viewports: [414, 1200] },
    staticQuery: {
      allContentfulStartseite: allContentfulStartseite(),
    },
  },
}

const Template: ComponentStory<typeof LayoutView> = ({
  children,
  ...args
}: LayoutViewProps) => <LayoutView {...args}>{children}</LayoutView>

export const SideNavClosed = Template.bind({})
SideNavClosed.args = {
  children: "content",
  crumbs: [
    { title: "Startseite", slug: "" },
    { title: "Unterseite", slug: "slug" },
  ],
  isSideNavOpen: false,
  setIsSideNavOpen: () => undefined,
}

export const SideNavOpen = Template.bind({})
SideNavOpen.args = {
  ...SideNavClosed.args,
  isSideNavOpen: true,
}
