import * as React from "react"
import CollapsibleController, {
  CollapsibleControllerProps,
} from "./CollapsibleController"
import CollapsibleView, { CollapsibleViewProps } from "./CollapsibleView"

export type CollapsibleProps = Pick<
  CollapsibleViewProps,
  "label" | "children"
> &
  Pick<CollapsibleControllerProps, "initExpanded">

const Collapsible = ({
  initExpanded,
  label,
  children,
}: CollapsibleProps): JSX.Element => {
  return (
    <CollapsibleController
      initExpanded={initExpanded}
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
