import React from "react"
import {
  AnalyticsClient,
  OpenAPIConfig,
} from "../../../../analytics-client/index"

export const createClient = (config?: Partial<OpenAPIConfig>) =>
  new AnalyticsClient({
    BASE: process.env.GATSBY_ANALYTICS_URL,
    ...config,
  })

const AnalyticsClientContext = React.createContext(createClient())

export default AnalyticsClientContext
