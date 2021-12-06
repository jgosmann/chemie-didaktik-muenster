import * as React from "react"
import CollapsibleController from "./CollapsibleController"
import CollapsibleView, { CollapsibleViewProps } from "./CollapsibleView"

export type CollapsibleProps = Pick<CollapsibleViewProps, "label" | "children">

const Collapsible = ({ label, children }: CollapsibleProps): JSX.Element => {
  return (
    <CollapsibleController
      render={({ isExpanded, onToggle }) => (
        <CollapsibleView
          label={label}
          isExpanded={isExpanded}
          onToggle={onToggle}
        >
          {children}
        </CollapsibleView>
      )}
    />
  )
}

export default Collapsible
