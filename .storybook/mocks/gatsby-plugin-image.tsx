// eslint-disable-next-line @typescript-eslint/no-var-requires
const React = require("react")

function StaticImage({ src }: { src: string }) {
  return <div>StaticImage: {src}</div>
}

module.exports = require("gatsby-plugin-image-original")
module.exports.StaticImage = StaticImage
