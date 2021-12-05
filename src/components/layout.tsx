/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React, { useState } from "react"
import PropTypes from "prop-types"

import Breadcrumbs, { Breadcrumb } from "../components/breadcrumbs"
import Header from "./header"
import Footer from "./footer"
import SideNav from "./sideNav"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"

export interface LayoutProps {
  children: React.ReactNode
  crumbs: Breadcrumb[]
}

const Layout = ({ children, crumbs }: LayoutProps) => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-grow">
        <SideNav
          isOpen={isSideNavOpen}
          onClose={() => setIsSideNavOpen(false)}
        />
        <main className="px-8 pt-4 mb-24 flex-grow overflow-hidden">
          <div className="flex justify-between">
            <Breadcrumbs crumbs={crumbs} />
            <button
              onClick={() => setIsSideNavOpen(true)}
              className="lg:hidden"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
