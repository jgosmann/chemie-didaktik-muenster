import { useContext, useEffect } from "react"
import AnalyticsClientContext from "./controls/admin/AnalyticsClient"

export interface AnalyticsTrackerProps {
  location: {
    origin: string
    pathname: string
  }
}

const AnalyticsTracker = ({ location }: AnalyticsTrackerProps) => {
  const analyticsClient = useContext(AnalyticsClientContext)
  useEffect(() => {
    analyticsClient.default
      .postIncrementActionActionsIncrementPost(
        `${location.origin}${location.pathname}`
      )
      .catch(err => console.warn(err))
  }, [analyticsClient, location])
  return null
}

export default AnalyticsTracker
