/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */

// You can delete this file if you're not using it

import "./src/styles/global.css"

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
