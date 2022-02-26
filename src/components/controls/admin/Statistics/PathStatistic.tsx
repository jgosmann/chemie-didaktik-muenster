import { faLink } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "gatsby"
import React from "react"
import Collapsible from "../../Collapsible"
import Row, { PathNode } from "./Row"
import { TreeIconProps } from "./TreeIcon"

export interface PathStatisticProps {
  prefix?: string
  treeIcons?: Pick<TreeIconProps, "isLast">[]
  node: PathNode
}

const PathRow = ({ prefix, node, treeIcons }: PathStatisticProps) => (
  <Row node={node} treeIcons={treeIcons}>
    {prefix}
    {node.name}
    <Link to={`${prefix}${node.name}`}>
      <FontAwesomeIcon
        icon={faLink}
        fixedWidth
        title="Gehe zur Seite"
        className="ml-2"
      />
    </Link>
  </Row>
)

const PathStatistic = ({ prefix, node, treeIcons }: PathStatisticProps) => {
  if (!node.nested || node.nested.length == 0) {
    return <PathRow prefix={prefix} node={node} treeIcons={treeIcons} />
  } else {
    return (
      <Collapsible
        label={<PathRow prefix={prefix} node={node} treeIcons={treeIcons} />}
      >
        {node.nested.map((child, i) => (
          <PathStatistic
            prefix={`${prefix}${node.name}/`}
            node={child}
            key={child.name}
            treeIcons={[
              ...(treeIcons ?? []),
              { isLast: i === node.nested.length - 1 },
            ]}
          />
        ))}
      </Collapsible>
    )
  }
}

export default PathStatistic
