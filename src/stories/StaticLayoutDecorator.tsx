import React from "react"
import { StaticLayout } from "../components/layout"

const StaticLayoutDecorator = (Story: React.ComponentType) => (
  <StaticLayout>
    <Story />
  </StaticLayout>
)

export default StaticLayoutDecorator
