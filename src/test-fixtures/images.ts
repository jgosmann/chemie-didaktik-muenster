import { IGatsbyImageData } from "gatsby-plugin-image"

export const fixedImage = ({
  url,
  width,
  height,
}: {
  url: string
  width: number
  height: number
}): { gatsbyImageData: IGatsbyImageData } => ({
  gatsbyImageData: {
    layout: "fixed",
    width,
    height,
    images: {
      fallback: {
        src: url,
      },
    },
  },
})

export const youtubeThumbnail = (
  { width, height } = { width: 256, height: 160 }
) =>
  fixedImage({
    url: "https://img.youtube.com/vi/IdkCEioCp24/default.jpg",
    width,
    height,
  })

export const largeFill = (suffix: string) =>
  fixedImage({ url: `/fill-${suffix}.png`, width: 1920, height: 1080 })
