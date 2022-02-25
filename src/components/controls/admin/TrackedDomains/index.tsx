import React, { useState } from "react"
import { useContext } from "react"
import { useEffect } from "react"
import AnalyticsClientContext from "../AnalyticsClient"
import TrackedDomainsControl from "./TrackedDomainsControl"

class Loading {}

class Success {
  constructor(public data: { trackedDomains: string[] }) {}
}

class Error {}

type State = Loading | Success | Error

const TrackedDomains = (): JSX.Element => {
  const [state, setState] = useState<State>(new Loading())

  const analyticsClient = useContext(AnalyticsClientContext)
  useEffect(() => {
    setState(new Loading())
    analyticsClient.default
      .getTrackedDomainsTrackedDomainsGet()
      .then(data => {
        setState(new Success({ trackedDomains: data.tracked_domains }))
      })
      .catch(e => {
        setState(new Error())
        console.error(e)
      })
  }, [analyticsClient])

  if (state instanceof Loading) {
    return <p>Loading ...</p>
  }

  if (state instanceof Error) {
    return <p>Error</p>
  }

  return (
    <TrackedDomainsControl initialTrackedDomains={state.data.trackedDomains} />
  )
}

export default TrackedDomains
