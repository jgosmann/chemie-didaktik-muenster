import React, { useCallback } from "react"
import { useContext } from "react"
import AnalyticsClientContext from "../AnalyticsClient"
import DataLoader from "../DataLoader"
import TrackedDomainsControl from "./TrackedDomainsControl"

const TrackedDomains = (): JSX.Element => {
  const analyticsClient = useContext(AnalyticsClientContext)
  const load = useCallback(
    () => analyticsClient.default.getTrackedDomainsTrackedDomainsGet(),
    [analyticsClient]
  )
  return (
    <DataLoader
      load={load}
      render={data => (
        <TrackedDomainsControl initialTrackedDomains={data.tracked_domains} />
      )}
    />
  )
}

export default TrackedDomains
