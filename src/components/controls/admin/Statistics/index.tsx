import React, { useCallback, useContext } from "react"
import AnalyticsClientContext from "../AnalyticsClient"
import DataLoader from "../DataLoader"
import prepareData from "./prepareData"
import Statistics from "./Statistics"

const ConnectedStatistics = () => {
  const analyticsClient = useContext(AnalyticsClientContext)
  const load = useCallback(
    () => analyticsClient.default.getStatisticsClicksStatisticsClicksGet(),
    [analyticsClient]
  )
  return (
    <DataLoader
      load={load}
      render={data => <Statistics data={prepareData(data.clicks)} />}
    />
  )
}

export default ConnectedStatistics
