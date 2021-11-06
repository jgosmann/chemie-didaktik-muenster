import React, { useRef, useState } from "react"
import YouTube from "react-youtube"
import Overlay from "./overlay"
import Video from "./video"

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
          video.current?.pauseVideo()
          setIsOpen(false)
        }}
      >
        <Video
          url={videoUrl}
          width="640"
          height="400"
          ref={video}
          className="max-h-80vh"
        />
      </Overlay>
    </>
  )
}

export default VideoBtn
