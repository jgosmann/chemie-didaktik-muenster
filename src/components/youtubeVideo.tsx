import React from "react"
import YouTube from "react-youtube"
import { extractVideoId } from "../youtube-url-parser"

export interface YoutubeVideoProps {
  url: string
  width?: string
  height?: string
  className?: string
  autoplay?: boolean
}

const YoutubeVideo = React.forwardRef<YT.Player, YoutubeVideoProps>(
  (
    { url, width, height, className, autoplay = false }: YoutubeVideoProps,
    ref
  ): JSX.Element => {
    const videoId = extractVideoId(url)
    return (
      <YouTube
        videoId={videoId}
        opts={{
          width,
          height,
          host: "https://www.youtube-nocookie.com",
          playerVars: { autoplay: autoplay ? 1 : 0 },
        }}
        className={`max-w-full max-h-screen ${className}`}
        onReady={ev => {
          if (ref && typeof ref === "object") {
            ref.current = ev.target
          }
        }}
      />
    )
  }
)

export default YoutubeVideo
