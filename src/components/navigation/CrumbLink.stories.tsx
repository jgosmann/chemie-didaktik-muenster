import React from "react"
import CrumbLink from "./CrumbLink"

export default {
  title: "Navigation/Crumb Link",
  component: CrumbLink,
}

export const Default = () => (
  <CrumbLink crumbs={[{ slug: "" }, { slug: "slug0" }, { slug: "slug1" }]}>
    Link text
  </CrumbLink>
)

export const StartPage = () => (
  <CrumbLink crumbs={[{ slug: "" }]}>Link text</CrumbLink>
)

export const WithCssClass = () => (
  <CrumbLink crumbs={[{ slug: "" }]} className="border">
    Link text
  </CrumbLink>
)
