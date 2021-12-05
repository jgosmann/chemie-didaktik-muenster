import { faPlay } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image"
import React, { useCallback, useState } from "react"
import Overlay from "./overlay"
import YoutubeConsent from "./youtubeConsent"
import YoutubeVideo from "./youtubeVideo"

export interface VideoProps {
  url: string
  thumb?: ImageDataLike
  width?: string
  height?: string
  className?: string
}

const Video = React.forwardRef<YT.Player, VideoProps>(function Video(
  // eslint-disable-next-line react/prop-types
  { url, thumb, width, height, className }: VideoProps,
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
        url={url}
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
        <button
          onClick={acquireConsent}
          className={`block relative max-w-full max-h-screen overflow-hidden ${className}`}
        >
          {thumbImage && (
            <GatsbyImage image={thumbImage} alt="Video thumbnail" />
          )}
          <div className="block rounded-md border-2 border-gray-100 hover:border-primary w-12 h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 filter drop-shadow-lg text-gray-100 bg-black hover:text-primary">
            <FontAwesomeIcon
              icon={faPlay}
              size="2x"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </button>
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
