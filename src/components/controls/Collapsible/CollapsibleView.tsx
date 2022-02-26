import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect } from "react"

export interface RenderLabelProps {
  label: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
}
export interface CollapsibleViewProps {
  label: React.ReactNode
  children: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
  renderLabel?: (props: RenderLabelProps) => JSX.Element
}

export interface ToggleButtonProps {
  isExpanded: boolean
  onToggle: () => void
  className?: string
}

export const ToggleButton = ({
  onToggle,
  isExpanded,
  className,
}: ToggleButtonProps) => (
  <button
    onClick={onToggle}
    className={`bg-gray-600 text-gray-200 rounded w-7 h-7 leading-7 shrink-0 ${className}`}
    title={isExpanded ? "Einklappen" : "Ausklappen"}
  >
    <FontAwesomeIcon
      icon={faChevronDown}
      className={`motion-safe:transition-transform ${
        isExpanded ? "rotate-180" : ""
      }`}
    />
  </button>
)

export const renderDefaultLabel = ({
  label,
  isExpanded,
  onToggle,
}: RenderLabelProps) => (
  <div className="flex justify-between gap-2">
    <div className="grow">{label}</div>
    <ToggleButton onToggle={onToggle} isExpanded={isExpanded} />
  </div>
)

const CollapsibleView = ({
  label,
  children,
  isExpanded,
  onToggle,
  renderLabel = renderDefaultLabel,
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
      {renderLabel({ label, isExpanded, onToggle })}
      <div
        ref={ref}
        className="overflow-hidden transition-height"
        style={{
          maxHeight: isExpanded ? height : 0,
        }}
      >
        {children}
      </div>
    </>
  )
}

export default CollapsibleView
