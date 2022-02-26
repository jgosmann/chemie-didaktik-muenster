import React from "react"
import Collapsible from "../../Collapsible"
import PathStatistic from "./PathStatistic"
import Row, { PathNode } from "./Row"

export interface DomainNode {
  domain: string
  count: number
  nestedCount: number
  nested?: PathNode[]
}

export interface DomainStatisticProps {
  node: DomainNode
}

const DomainRow = ({ node }: DomainStatisticProps) => (
  <Row node={{ name: node.domain, ...node }}>
    <span className="font-bold">{node.domain}</span>
  </Row>
)

const DomainStatistic = ({ node }: DomainStatisticProps) => {
  return (
    <Collapsible label={<DomainRow node={node} />}>
      {node.nested?.map((child, i) => (
        <PathStatistic
          prefix="/"
          node={child}
          key={child.name}
          treeIcons={[{ isLast: i === node.nested.length - 1 }]}
        />
      ))}
    </Collapsible>
  )
}

export default DomainStatistic
