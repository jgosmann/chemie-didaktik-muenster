import React, { CSSProperties, useCallback, useEffect } from "react"

export interface OverlayProps {
  children?: React.ReactNode
  onClose?: () => void
  isActive: boolean
}

const activeStyle: CSSProperties = {
  opacity: 1,
  pointerEvents: "auto",
  zIndex: 50,
}
const inactiveStyle: CSSProperties = {
  opacity: 0,
  pointerEvents: "none",
}

const Overlay = ({ children, isActive, onClose }: OverlayProps) => {
  useEffect(() => {
    const keypressHandler = ev => {
      if (ev.key === "Escape") {
        onClose()
      }
    }
    if (isActive) {
      document.body.style.overflow = "hidden"
      document.addEventListener("keydown", keypressHandler)
    } else {
      document.body.style.overflow = "scroll"
    }

    return () => {
      document.body.style.overflow = "scroll"
      document.removeEventListener("keydown", keypressHandler)
    }
  }, [isActive, onClose])

  return (
    <div
      onClick={onClose}
      className="fixed max-h-screen p-8 flex items-center justify-center inset-0 w-screen h-screen bg-black bg-opacity-75 transition-opacity overflow-scroll"
      style={isActive ? activeStyle : inactiveStyle}
    >
      <div className="relative max-w-full mx-4">
        <div
          className="bg-white rounded-lg overflow-hidden"
          onClick={ev => ev.stopPropagation()}
        >
          {children}
        </div>
        <button
          onClick={onClose}
          className="hover:ring active:ring focus:ring bg-gray-100 rounded-full h-7 w-7 absolute top-1 right-1 transform translate-x-1/2 -translate-y-1/2 shadow-md border-2 border-gray-800"
        >
          X
        </button>
      </div>
    </div>
  )
}

export default Overlay
