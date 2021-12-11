import { ComponentStory } from "@storybook/react"
import React from "react"
import { LayoutView, LayoutViewProps } from "."
import { decorator } from "../../../.storybook/__mocks__/gatsby"

export default {
  title: "Layout",
  component: LayoutView,
  decorators: [decorator],
  parameters: {
    chromatic: { disableSnapshot: false, viewports: [414, 1200] },
    staticQuery: {
      allContentfulStartseite: {
        nodes: [
          {
            title: "Test title",
            crumbs: [{ slug: "testTitle" }],
            conceptPages: [
              {
                id: "id",
                title: "Concept title",
                crumbs: [{ slug: "testTitle" }, { slug: "conceptTitle" }],
                linkedContent: [],
              },
            ],
          },
        ],
      },
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
