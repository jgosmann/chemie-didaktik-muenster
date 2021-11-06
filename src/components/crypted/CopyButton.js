import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopy } from "@fortawesome/free-solid-svg-icons"
import React from "react"
import PropTypes from "prop-types"

import AnimatedButton from "../AnimatedButton"

const CopyButton = ({ getCopyText, title }) => {
  const onClick = () => {
    navigator.clipboard.writeText(getCopyText())
  }
  return (
    <AnimatedButton onClick={onClick} title={title} className="ml-1">
      <FontAwesomeIcon icon={faCopy} />
    </AnimatedButton>
  )
}

CopyButton.propTypes = {
  getCopyText: PropTypes.func.isRequired,
  title: PropTypes.string,
}

export default CopyButton
