import React from "react"
import DomainStatistic, { DomainNode } from "./DomainStatistics"
import { Header } from "./Row"

export interface StatisticsProps {
  data: DomainNode[]
}

const Statistics = ({ data }: StatisticsProps) => (
  <div>
    <Header />
    {data.map(domainData => (
      <DomainStatistic key={domainData.domain} node={domainData} />
    ))}
  </div>
)

export default Statistics
