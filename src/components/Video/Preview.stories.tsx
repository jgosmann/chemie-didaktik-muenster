import React from "react"
import PreviewComponent from "./Preview"

export default {
  title: "Video/Preview",
  component: PreviewComponent,
  decorators: [
    Story => (
      <div style={{ width: 640, height: 400 }}>
        <Story />
      </div>
    ),
  ],
  parameters: { chromatic: { disableSnapshot: false } },
}

export const Thumbnail = () => (
  <PreviewComponent
    className="w-64 h-64"
    thumbImage={{
      layout: "fixed",
      width: 1920,
      height: 1080,
      images: {
        fallback: {
          src: "/fill-r.png",
        },
      },
    }}
  />
)
export const NoThumbnail = () => <PreviewComponent className="w-64 h-64" />
