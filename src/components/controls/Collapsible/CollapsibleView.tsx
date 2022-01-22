import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect } from "react"

export interface CollapsibleViewProps {
  label: React.ReactNode
  children: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
}

const CollapsibleView = ({
  label,
  children,
  isExpanded,
  onToggle,
}: CollapsibleViewProps): JSX.Element => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [height, setHeight] = React.useState(isExpanded ? undefined : 0)
  useEffect(() => {
    const rerender = () => {
      setHeight(ref.current?.scrollHeight)
    }

    const resizeObserver = new ResizeObserver(rerender)
    resizeObserver.observe(ref.current)
    const children = ref.current?.children
    for (let i = 0; i < children.length; ++i) {
      resizeObserver.observe(children[i])
    }

    return () => resizeObserver.disconnect()
  }, [ref.current])

  return (
    <>
      <div className="flex justify-between gap-2">
        <div>{label}</div>
        <button
          onClick={onToggle}
          className="bg-gray-600 text-gray-200 rounded w-7 h-7 shrink-0"
          title={isExpanded ? "Einklappen" : "Ausklappen"}
        >
          <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
        </button>
      </div>
      <div
        ref={ref}
        className="overflow-hidden"
        style={{
          maxHeight: isExpanded ? height : 0,
          transition: "max-height 0.2s ease-out",
        }}
      >
        {children}
      </div>
    </>
  )
}

export default CollapsibleView
