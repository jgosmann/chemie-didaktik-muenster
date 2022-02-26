import React from "react"
import Cell, { CellProps } from "./Cell"

const NumberCell = ({ className, children, ...props }: CellProps) => (
  <Cell className={`text-right w-28 ${className}`} {...props}>
    {children}
  </Cell>
)

export default NumberCell
