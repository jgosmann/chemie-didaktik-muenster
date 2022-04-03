import React from "react"

export type CellProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}

const Cell = ({ children, className, ...remainder }: CellProps) => (
  <div className={`m-1 p-1 shrink-0 ${className ?? ""}`} {...remainder}>
    {children}
  </div>
)

export default Cell
