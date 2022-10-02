import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopy } from "@fortawesome/free-regular-svg-icons"
import React from "react"

import AnimatedButton from "../controls/AnimatedButton"

export interface CopyButtonProps {
  getCopyText: () => string
  title?: string
}

const CopyButton = ({ getCopyText, title }: CopyButtonProps) => {
  const onClick = () => {
    navigator.clipboard.writeText(getCopyText())
  }
  return (
    <AnimatedButton onClick={onClick} title={title} className="ml-1">
      <FontAwesomeIcon icon={faCopy} />
    </AnimatedButton>
  )
}

export default CopyButton
