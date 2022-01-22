import * as React from "react"
import CollapsibleController, {
  CollapsibleControllerProps,
} from "./CollapsibleController"
import CollapsibleView, { CollapsibleViewProps } from "./CollapsibleView"

export type CollapsibleProps = Pick<
  CollapsibleViewProps,
  "label" | "children" | "renderLabel"
> &
  Pick<CollapsibleControllerProps, "initExpanded" | "expandOnHash">

const Collapsible = ({
  initExpanded,
  expandOnHash,
  label,
  children,
  renderLabel,
}: CollapsibleProps): JSX.Element => {
  return (
    <CollapsibleController
      initExpanded={initExpanded}
      expandOnHash={expandOnHash}
      render={({ isExpanded, onToggle }) => (
        <CollapsibleView
          label={label}
          isExpanded={isExpanded}
          onToggle={onToggle}
          renderLabel={renderLabel}
        >
          {children}
        </CollapsibleView>
      )}
    />
  )
}

export default Collapsible
