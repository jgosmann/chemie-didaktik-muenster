import React, { useContext, useEffect, useState } from "react"

import Header from "./Header"
import Footer from "./Footer"
import SideNav from "./SideNav"
import LocationContext from "../LocationContext"

export interface StaticLayoutViewProps {
  children: React.ReactNode
  isSideNavOpen: boolean
  setIsSideNavOpen: (isOpen: boolean) => void
}

type StaticLayoutProps = Omit<
  StaticLayoutViewProps,
  "isSideNavOpen" | "setIsSideNavOpen"
>

export const StaticLayoutView = ({
  children,
  isSideNavOpen,
  setIsSideNavOpen,
}: StaticLayoutViewProps) => (
  <>
    <Header />
    <SideNav isOpen={isSideNavOpen} onClose={() => setIsSideNavOpen(false)} />
    <div className="flex flex-col h-screen">
      <div className="flex grow lg:ml-96 mt-16">{children}</div>
      <Footer />
    </div>
  </>
)

export const SetIsSideNavOpenContext = React.createContext<
  (state: boolean) => void
>(() => undefined)

const StaticLayout = ({ children, ...props }: StaticLayoutProps) => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)

  const location = useContext(LocationContext)
  useEffect(() => setIsSideNavOpen(false), [location])

  return (
    <StaticLayoutView
      {...props}
      isSideNavOpen={isSideNavOpen}
      setIsSideNavOpen={setIsSideNavOpen}
    >
      <SetIsSideNavOpenContext.Provider value={setIsSideNavOpen}>
        {children}
      </SetIsSideNavOpenContext.Provider>
    </StaticLayoutView>
  )
}

export default StaticLayout
