import React, { useEffect, useState } from "react"

export interface AnimatedButtonProps {
  children: React.ReactNode
  onClick?: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  title?: string
  className?: string
}

const AnimatedButton = ({
  children,
  onClick,
  title,
  className,
}: AnimatedButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false)
  useEffect(() => {
    if (isAnimating) {
      window.setTimeout(() => setIsAnimating(false), 200)
    }
  }, [isAnimating])

  const onClickInternal = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setIsAnimating(true)
    onClick && onClick(e)
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

export default AnimatedButton
