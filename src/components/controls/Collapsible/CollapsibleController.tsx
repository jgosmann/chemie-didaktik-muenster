import { useState, useCallback } from "react"

export interface CollapsibleControllerProps {
  render: (props: { isExpanded: boolean; onToggle: () => void }) => JSX.Element
}

const CollapsibleController = ({
  render,
}: CollapsibleControllerProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false)
  const onToggle = useCallback(
    () => setIsExpanded(isExpanded => !isExpanded),
    []
  )
  return render({ isExpanded, onToggle })
}

export default CollapsibleController
