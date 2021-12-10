import React, { useRef, useState } from "react"
import Overlay from "../overlay"
import YoutubeConsent from "../youtubeConsent"
import YoutubeVideo from "../youtubeVideo"

export interface VideoBtnProps {
  children?: React.ReactNode
  videoUrl: string
}

const VideoBtn = ({ children, videoUrl }: VideoBtnProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [hasConsent, setHasConsent] = useState(false)
  const video = useRef<YT.Player>(null)

  return (
    <>
      <button className="btn primary" onClick={() => setIsOpen(true)}>
        {children}
      </button>
      <Overlay
        isActive={isOpen}
        onClose={() => {
          video.current?.pauseVideo()
          setIsOpen(false)
        }}
      >
        {hasConsent ? (
          <YoutubeVideo
            url={videoUrl}
            width="640"
            height="400"
            ref={video}
            className="max-h-80vh"
          />
        ) : (
          <YoutubeConsent
            onConsentGiven={() => setHasConsent(true)}
            onConsentDenied={() => {
              setHasConsent(false)
              setIsOpen(false)
            }}
          />
        )}
      </Overlay>
    </>
  )
}

export default VideoBtn
