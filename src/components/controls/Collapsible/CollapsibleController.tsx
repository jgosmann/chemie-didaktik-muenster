import { useState, useCallback, useEffect, useContext } from "react"
import LocationContext from "../../LocationContext"

export interface CollapsibleControllerProps {
  initExpanded?: boolean
  expandOnHash?: string
  render: (props: { isExpanded: boolean; onToggle: () => void }) => JSX.Element
}

const CollapsibleController = ({
  initExpanded,
  expandOnHash,
  render,
}: CollapsibleControllerProps): JSX.Element => {
  const location = useContext(LocationContext)
  const [isExpanded, setIsExpanded] = useState(!!initExpanded)
  useEffect(() => {
    if (location.hash === expandOnHash) {
      setIsExpanded(true)
    }
  }, [location])
  const onToggle = useCallback(
    () => setIsExpanded(isExpanded => !isExpanded),
    []
  )
  return render({ isExpanded, onToggle })
}

export default CollapsibleController
