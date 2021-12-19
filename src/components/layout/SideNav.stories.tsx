import React from "react"
import { allContentfulStartseite } from "../../test-fixtures/content"
import { SideNavView } from "./SideNav"

export default {
  title: "Layout/Side Navigation",
  component: SideNavView,
}

const queryData = {
  allContentfulStartseite: allContentfulStartseite(),
}

export const SideNavigation = () => (
  <SideNavView isOpen onClose={() => undefined} query={queryData} />
)
