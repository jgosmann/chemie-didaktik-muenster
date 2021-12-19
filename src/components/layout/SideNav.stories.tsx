import React from "react"
import { SideNavView } from "./SideNav"

export default {
  title: "Layout/Side Navigation",
  component: SideNavView,
}

const queryData = {
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
            linkedContent: [
              {
                id: "sub-id",
                title: "Linked content",
                crumbs: [
                  { slug: "testTitle" },
                  { slug: "conceptTitle" },
                  { slug: "linkendTitle" },
                ],
              },
            ],
            studentPresentations: { raw: "", references: [] },
            additionalBackground: { raw: "", references: [] },
          },
        ],
      },
    ],
  },
}

export const SideNavigation = () => (
  <SideNavView isOpen onClose={() => undefined} query={queryData} />
)
