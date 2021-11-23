/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React, { useState } from "react"
import PropTypes from "prop-types"

import Breadcrumbs from "../components/breadcrumbs"
import Header from "./header"
import Footer from "./footer"
import SideNav from "./sideNav"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"

const Layout = ({ children, crumbs }) => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-grow">
        <div>
          <SideNav
            isOpen={isSideNavOpen}
            onClose={() => setIsSideNavOpen(false)}
          />
          <main className="px-8 pt-4">
            <div className="flex justify-between">
              <Breadcrumbs crumbs={crumbs} />
              <button onClick={() => setIsSideNavOpen(true)}>
                <FontAwesomeIcon icon={faBars} />
              </button>
            </div>
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
