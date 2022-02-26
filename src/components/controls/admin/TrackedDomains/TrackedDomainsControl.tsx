import React, { useCallback } from "react"
import { useContext } from "react"
import { useState } from "react"
import AnalyticsClientContext from "../AnalyticsClient"
import SaveableForm from "../SaveableForm"
import Input from "./Input"

export interface TrackedDomainsControlProps {
  initialTrackedDomains: string[]
}

const TrackedDomainsControl = ({
  initialTrackedDomains,
}: TrackedDomainsControlProps): JSX.Element => {
  const [trackedDomains, setTrackedDomains] = useState(initialTrackedDomains)

  const analyticsClient = useContext(AnalyticsClientContext)
  const save = useCallback(() => {
    return analyticsClient.default.putTrackedDomainsTrackedDomainsPut({
      tracked_domains: trackedDomains,
    })
  }, [analyticsClient, trackedDomains])

  return (
    <SaveableForm save={save} disabled={trackedDomains.length === 0}>
      <h2 className="text-xl mb-1">
        <label htmlFor="tracked-domains">Getrackte Domains</label>
      </h2>
      <Input
        id="tracked-domains"
        name="tracked-domains"
        trackedDomains={trackedDomains}
        onChange={setTrackedDomains}
      />
    </SaveableForm>
  )
}

export default TrackedDomainsControl
