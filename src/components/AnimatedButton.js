import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"

const AnimatedButton = ({ children, onClick, title, className }) => {
  const [isAnimating, setIsAnimating] = useState(false)
  useEffect(() => {
    if (isAnimating) {
      window.setTimeout(() => setIsAnimating(false), 200)
    }
  }, [isAnimating])

  const onClickInternal = e => {
    setIsAnimating(true)
    onClick(e)
  }

  return (
    <button
      onClick={onClickInternal}
      title={title}
      className={"relative " + (className || "")}
    >
      {children}
      {isAnimating ? (
        <div className="animate-ping absolute inset-0">{children}</div>
      ) : null}
    </button>
  )
}

AnimatedButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  title: PropTypes.string,
}

export default AnimatedButton
