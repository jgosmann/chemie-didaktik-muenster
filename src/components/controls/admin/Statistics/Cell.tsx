import React from "react"

export type CellProps = React.HTMLAttributes<HTMLDivElement>

const Cell = ({ children, className, ...remainder }: CellProps) => (
  <div className={`m-2 ${className ?? ""}`} {...remainder}>
    {children}
  </div>
)

export default Cell
