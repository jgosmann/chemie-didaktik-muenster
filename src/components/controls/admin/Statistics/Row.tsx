import React from "react"
import Cell from "./Cell"
import NumberCell from "./NumberCell"
import TreeIcon, { TreeIconProps } from "./TreeIcon"

export interface PathNode {
  name: string
  count: number
  nestedCount: number
  nested?: PathNode[]
}

export interface RowProps {
  children?: React.ReactNode
  treeIcons?: Pick<TreeIconProps, "isLast">[]
  node: PathNode
}

export const Header = () => (
  <div className="flex items-end rounded font-bold text-sm">
    <NumberCell className="border-b-2 p-1 m-1">Aufrufe</NumberCell>
    <NumberCell className="border-b-2 p-1 m-1">
      davon auf exakten Pfad
    </NumberCell>
    <Cell className="border-b-2 m-0"></Cell>
    <Cell className="border-b-2 grow p-1 m-1 mr-0">Pfad</Cell>
  </div>
)

const Row = ({ children, node, treeIcons }: RowProps) => (
  <div className="flex items-stretch hover:bg-gray-100 rounded">
    <NumberCell>{node.nestedCount + node.count}</NumberCell>
    <NumberCell>{node.count}</NumberCell>
    <Cell className="my-0 pl-0">
      {treeIcons?.map((treeIconProps, i) => (
        <TreeIcon
          key={i}
          {...treeIconProps}
          isInnermost={i === treeIcons.length - 1}
        />
      ))}
    </Cell>
    <Cell className="ml-0 pl-0 grow">{children}</Cell>
  </div>
)

export default Row
