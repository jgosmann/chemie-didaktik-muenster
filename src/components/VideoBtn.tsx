import React, { useRef, useState } from "react"
import Overlay from "./overlay"

export interface VideoBtnProps {
  children?: React.ReactNode
  videoUrl: string
}

const VideoBtn = ({ children, videoUrl }: VideoBtnProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const video = useRef(null)

  return (
    <>
      <button className="btn" onClick={() => setIsOpen(true)}>
        {children}
      </button>
      <Overlay
        isActive={isOpen}
        onClose={() => {
          video.current?.pause()
          setIsOpen(false)
        }}
      >
        <video
          controls
          ref={video}
          src={videoUrl}
          style={{ maxHeight: "80vh" }}
        />
      </Overlay>
    </>
  )
}

export default VideoBtn
