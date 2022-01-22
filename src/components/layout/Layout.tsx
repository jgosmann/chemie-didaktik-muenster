/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React, { useContext } from "react"

import Breadcrumbs, { Breadcrumb } from "../navigation/Breadcrumbs"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { SetIsSideNavOpenContext } from "./StaticLayout"

export interface LayoutProps {
  children: React.ReactNode
  crumbs: Breadcrumb[]
}

const Layout = ({ children, crumbs }: LayoutProps) => {
  const setIsSideNavOpen = useContext(SetIsSideNavOpenContext)
  return (
    <div className="px-8 pt-4 mb-24 grow overflow-hidden">
      <div className="flex justify-between">
        <Breadcrumbs crumbs={crumbs} />
        <button onClick={() => setIsSideNavOpen(true)} className="lg:hidden">
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      <main>{children}</main>
    </div>
  )
}

export default Layout
