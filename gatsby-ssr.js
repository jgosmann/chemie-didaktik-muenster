/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/ssr-apis/
 */

// You can delete this file if you're not using it

import React from "react"
import { StaticLayout } from "./src/components/layout"

export const wrapPageElement = ({ element, props }) => {
  return <StaticLayout {...props}>{element}</StaticLayout>
}
