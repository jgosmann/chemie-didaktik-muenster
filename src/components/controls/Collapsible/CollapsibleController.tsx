import { useState, useCallback } from "react"

export interface CollapsibleControllerProps {
  initExpanded?: boolean
  render: (props: { isExpanded: boolean; onToggle: () => void }) => JSX.Element
}

const CollapsibleController = ({
  initExpanded,
  render,
}: CollapsibleControllerProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(!!initExpanded)
  const onToggle = useCallback(
    () => setIsExpanded(isExpanded => !isExpanded),
    []
  )
  return render({ isExpanded, onToggle })
}

export default CollapsibleController
