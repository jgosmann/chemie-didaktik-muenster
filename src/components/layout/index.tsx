/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React, { useState } from "react"
import PropTypes from "prop-types"

import Breadcrumbs, { Breadcrumb } from "../navigation/Breadcrumbs"
import Header from "./Header"
import Footer from "./Footer"
import SideNav from "./SideNav"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"

export interface LayoutViewProps {
  children: React.ReactNode
  crumbs: Breadcrumb[]
  isSideNavOpen: boolean
  setIsSideNavOpen: (isOpen: boolean) => void
}

type LayoutProps = Omit<LayoutViewProps, "isSideNavOpen" | "setIsSideNavOpen">

export const LayoutView = ({
  children,
  crumbs,
  isSideNavOpen,
  setIsSideNavOpen,
}: LayoutViewProps) => (
  <>
    <Header />
    <SideNav isOpen={isSideNavOpen} onClose={() => setIsSideNavOpen(false)} />
    <div className="flex flex-col h-screen">
      <div className="flex grow lg:ml-96">
        <main className="px-8 pt-4 mb-24 grow overflow-hidden">
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
  </>
)

const Layout = (props: LayoutProps) => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)

  return (
    <LayoutView
      {...props}
      isSideNavOpen={isSideNavOpen}
      setIsSideNavOpen={setIsSideNavOpen}
    />
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
