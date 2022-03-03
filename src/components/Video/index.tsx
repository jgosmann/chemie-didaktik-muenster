import { getImage, ImageDataLike } from "gatsby-plugin-image"
import React, { useCallback, useState } from "react"
import Overlay from "../Overlay"
import Preview from "./Preview"
import YoutubeConsent from "./YoutubeConsent"
import YoutubeVideo from "./YoutubeVideo"

export interface VideoProps {
  youtubeId: string
  thumb?: ImageDataLike
  width?: string
  height?: string
  className?: string
}

const Video = React.forwardRef<YT.Player, VideoProps>(function Video(
  // eslint-disable-next-line react/prop-types
  { youtubeId, thumb, width, height, className = "" }: VideoProps,
  ref
): JSX.Element {
  const [state, setState] = useState("no-consent")

  const acquireConsent = useCallback(() => {
    setState("acquire-consent")
  }, [])
  const onConsentGiven = useCallback(() => {
    setState("show-video")
  }, [])
  const onConsentDenied = useCallback(() => {
    setState("no-consent")
  }, [])

  if (state === "show-video") {
    return (
      <YoutubeVideo
        ref={ref}
        urlOrId={youtubeId}
        width={width}
        height={height}
        className={`max-w-full max-h-screen ${className}`}
        autoplay
      />
    )
  } else {
    const thumbImage = thumb && getImage(thumb)
    return (
      <>
        <Preview
          onClick={acquireConsent}
          thumbImage={thumbImage}
          className={className}
        />
        {state === "acquire-consent" && (
          <Overlay isActive={true} onClose={onConsentDenied}>
            <YoutubeConsent
              onConsentDenied={onConsentDenied}
              onConsentGiven={onConsentGiven}
            />
          </Overlay>
        )}
      </>
    )
  }
})

export default Video
