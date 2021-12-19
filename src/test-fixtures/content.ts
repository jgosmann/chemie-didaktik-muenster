import { largeFill, youtubeThumbnail } from "./images"
import { loremIpsum, richText } from "./richText"
import { testVideoUrl } from "./video"

export const slogan = ({
  id,
  html,
  fill,
}: {
  id: string
  html: string
  fill: string
}) => ({
  id,
  slogan: {
    childMarkdownRemark: {
      html,
    },
  },
  image: largeFill(fill),
})

export const conceptPage = ({ id, title }: { id: string; title: string }) => ({
  id,
  title,
  slug: id,
  crumbs: [
    { title: "Startseite", slug: "" },
    { title, slug: id },
  ],
  shortVideo: testVideoUrl,
  shortVideoThumb: youtubeThumbnail(),
  shortDescription: richText(`Some short description of ${title}.`),
  linkedContent: [],
})

export const allContentfulStartseite = () => ({
  nodes: [
    {
      title: "Startseite",
      crumbs: [{ title: "Startseite", slug: "" }],
      slogans: [
        slogan({
          id: "slogan-0",
          html: "This is the slogan text.",
          fill: "r",
        }),
      ],
      content: loremIpsum(),
      conceptPages: [
        conceptPage({
          id: "concept-page-min",
          title: "Concept page (min content)",
        }),
        {
          ...conceptPage({
            id: "concept-page-max",
            title: "Concept page (max content)",
          }),
          linkedContent: [
            {
              id: "linked-content-0",
              title: "Linked content",
              crumbs: [
                { title: "Startseite", slug: "" },
                {
                  title: "Concept page (max content)",
                  slug: "concept-page-max",
                },
                { title: "Linked content", slug: "linkend-content-0" },
              ],
            },
          ],

          studentPresentations: richText("Student presentations content."),
          additionalBackground: richText("Additional background content"),
        },
      ],
    },
  ],
})
