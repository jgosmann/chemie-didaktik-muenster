import React from "react"
import { largeFill } from "../../test-fixtures/images"
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
    thumbImage={largeFill("r").gatsbyImageData}
  />
)
export const NoThumbnail = () => <PreviewComponent className="w-64 h-64" />
