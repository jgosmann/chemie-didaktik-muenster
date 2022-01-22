/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/ssr-apis/
 */

// You can delete this file if you're not using it

import React from "react"
import { StaticLayout } from "./src/components/layout"
import LocationContext from "./src/components/LocationContext"

export const wrapPageElement = ({ element, props }) => {
  return (
    <LocationContext.Provider value={props.location}>
      <StaticLayout {...props}>{element}</StaticLayout>
    </LocationContext.Provider>
  )
}
