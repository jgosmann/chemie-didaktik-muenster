import React from "react"

export interface TreeIconProps {
  isLast?: boolean
  isInnermost?: boolean
}

const TreeIcon = ({ isLast, isInnermost }: TreeIconProps) => {
  return (
    <div
      className="inline-block w-4 h-full relative ml-2"
      style={{ minHeight: 24 }}
    >
      {(!isLast || isInnermost) && (
        <div className="absolute inset-x-0 h-1/2 w-0.5 bg-gray-600"></div>
      )}
      {!isLast && (
        <div className="absolute left-0 top-1/2 h-1/2 w-0.5 bg-gray-600"></div>
      )}
      {isInnermost && (
        <div className="absolute left-0 top-1/2 h-0.5 w-full bg-gray-600 -translate-y-1/2"></div>
      )}
    </div>
  )
}

export default TreeIcon
