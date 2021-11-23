import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as React from "react"

export interface CollapsibleProps {
  label: React.ReactNode
  children: React.ReactNode
}

const Collapsible = ({ label, children }: CollapsibleProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const ref = React.useRef(null)

  return (
    <>
      <div className="flex justify-between gap-2">
        <div>{label}</div>
        <button
          onClick={() => setIsExpanded(isExpanded => !isExpanded)}
          className="bg-gray-600 text-gray-200 rounded w-7 h-7 flex-shrink-0"
        >
          <FontAwesomeIcon
            icon={isExpanded ? faChevronUp : faChevronDown}
            title={isExpanded ? "Einklappen" : "Ausklappen"}
          />
        </button>
      </div>
      <div
        ref={ref}
        className="overflow-hidden"
        style={{
          height: isExpanded ? ref.current?.scrollHeight : 0,
          transition: "height 0.2s ease-out",
        }}
      >
        {children}
      </div>
    </>
  )
}

export default Collapsible
