import * as React from "react"
import YouTube from "react-youtube"

export interface VideoProps {
  url: string
  width?: string
  height?: string
  className?: string
}

const Video = React.forwardRef<any, VideoProps>(
  ({ url, width, height, className }: VideoProps, ref): JSX.Element => {
    const m1 = url.match(
      /(https?:\/\/)?(.*\.)?youtube\.com\/watch\?.*v=([_a-zA-Z0-9]+)/
    )
    const m2 = url.match(/(https?:\/\/)?(.*\.)?youtu\.be\/([_a-zA-Z0-9]+)/)
    const videoId = (m1 && m1[3]) || (m2 && m2[3]) || url
    return (
      <YouTube
        videoId={videoId}
        opts={{ width, height }}
        className={`max-w-full max-h-screen ${className}`}
        onReady={ev => {
          console.log("ready", ev.target)
          if (ref) {
            ;(ref as any).current = ev.target
          }
        }}
      />
    )
  }
)

export default Video
