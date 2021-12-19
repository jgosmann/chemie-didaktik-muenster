import { fileNode, largeFill, youtubeThumbnail } from "./images"
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
  description: loremIpsum(),
  shortVideo: testVideoUrl,
  shortVideoThumb: youtubeThumbnail(),
  shortDescription: richText(`Some short description of ${title}.`),
  linkedContent: [],
})

export const conceptPageWithAllOptionalContent = ({
  id,
  title,
}: {
  id: string
  title: string
}) => ({
  ...conceptPage({ id, title }),
  video: testVideoUrl,
  videoThumb: fileNode(youtubeThumbnail({ width: 640, height: 400 })),
  linkedContent: [
    {
      id: "linked-content-0",
      title: "Linked content 0",
      crumbs: [
        { title: "Startseite", slug: "" },
        {
          title,
          slug: id,
        },
        { title: "Linked content 0", slug: "linkend-content-0" },
      ],
      shortDescription: richText(
        "Some short descritpion for the linked content 0."
      ),
      shortVideo: testVideoUrl,
      shortVideoThumb: fileNode(youtubeThumbnail()),
    },
    {
      id: "linked-content-1",
      title: "Linked content 1",
      crumbs: [
        { title: "Startseite", slug: "" },
        {
          title,
          slug: id,
        },
        { title: "Linked content 1", slug: "linkend-content-1" },
      ],
      shortDescription: richText(
        "Some short descritpion for the linked content 1."
      ),
    },
  ],
  aboutAuthorVideo: testVideoUrl,
  aboutAuthorPreview: fileNode(youtubeThumbnail({ width: 42, height: 42 })),
  studentPresentations: richText("Student presentations content."),
  additionalBackground: richText("Additional background content"),
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
        conceptPageWithAllOptionalContent({
          id: "concept-page-max",
          title: "Concept page (max content)",
        }),
      ],
    },
  ],
})
