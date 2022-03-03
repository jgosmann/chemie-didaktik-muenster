import React from "react"
import { extractVideoId } from "../../../youtube-url-parser"
import { YoutubeVideoProps } from "../YoutubeVideo"

const YoutubeVideo = React.forwardRef<YT.Player, YoutubeVideoProps>(
  function YoutubeVideo(
    // eslint-disable-next-line react/prop-types
    { urlOrId }: YoutubeVideoProps,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ref
  ): JSX.Element {
    const videoId = extractVideoId(urlOrId)
    return <div title="YouTube video player">{videoId}</div>
  }
)

export default YoutubeVideo
