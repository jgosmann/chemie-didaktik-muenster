import React from "react"
import { gatsbyDecorator } from "../../../.storybook/mocks/gatsby"
import { allContentfulStartseite } from "../../test-fixtures/content"
import { richTextContainingAllElements } from "../../test-fixtures/richText"
import Layout, { LayoutProps } from "./Layout"
import { StaticLayoutView, StaticLayoutViewProps } from "./StaticLayout"

export default {
  title: "Layout",
  component: StaticLayoutView,
  decorators: [gatsbyDecorator],
  parameters: {
    chromatic: { disableSnapshot: false, viewports: [414, 1200] },
    staticQuery: {
      allContentfulStartseite: allContentfulStartseite(),
      faq: {
        content: richTextContainingAllElements,
      },
    },
    layout: "fullscreen",
  },
}

const Template = ({
  children,
  crumbs,
  ...args
}: StaticLayoutViewProps & LayoutProps) => (
  <StaticLayoutView {...args}>
    <Layout crumbs={crumbs}>{children}</Layout>
  </StaticLayoutView>
)

export const SideNavClosed = Template.bind({})
SideNavClosed.args = {
  activeCrumbs: [{ slug: "" }],
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
