import React from "react"

import BreadcrumbsComponent from "./Breadcrumbs"

export default {
  title: "Navigation/Breadcrumbs",
  component: BreadcrumbsComponent,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

export const Breadcrumbs = () => (
  <BreadcrumbsComponent
    crumbs={[
      { title: "Startseite", slug: "" },
      { title: "Level 1", slug: "level1" },
      { title: "Level 2", slug: "level2" },
    ]}
  />
)
