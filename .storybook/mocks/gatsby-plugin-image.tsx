module.exports = require("gatsby-plugin-image-original")
module.exports.StaticImage = ({ src }: { src: string }) => (
  <div>StaticImage: {src}</div>
)
