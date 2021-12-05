import {
  ContentfulRichTextGatsbyReference,
  RenderRichTextData,
} from "gatsby-source-contentful/rich-text"
import { graphql } from "gatsby"
import {
  FileNode,
  ImageDataLike,
} from "gatsby-plugin-image/dist/src/components/hooks"
import * as React from "react"
import { Breadcrumb } from "../components/navigation/Breadcrumbs"
import Card from "../components/Card"
import ConceptNav, { AboutAuthorMedia } from "../components/conceptNav"
import Layout from "../components/layout"
import RichText from "../components/richText"
import Seo from "../components/seo"
import Video from "../components/video"

export const query = graphql`
  query ConceptPageQuery($id: String!) {
    contentfulConceptPage(id: { eq: $id }) {
      title
      slug
      crumbs {
        title
        slug
      }
      video
      videoThumb {
        childImageSharp {
          gatsbyImageData(layout: FIXED, width: 640, height: 400)
        }
      }
      description {
        ...RichTextFragment
      }
      linkedContent {
        id
        title
        crumbs {
          slug
        }
        shortVideo
        shortVideoThumb {
          childImageSharp {
            ...CardVideoThumbFragment
          }
        }
        shortDescription {
          ...RichTextFragment
        }
        downloadLink {
          file {
            url
          }
        }
      }
      studentPresentations {
        ...RichTextFragment
      }
      additionalBackground {
        ...RichTextFragment
      }
      ...ConceptNavAuthorMedia
    }
  }
`

export interface ConceptPageType extends AboutAuthorMedia {
  title: string
  slug: string
  crumbs: Breadcrumb[]
  video?: string
  videoThumb?: FileNode
  description: RenderRichTextData<ContentfulRichTextGatsbyReference>
  linkedContent: Array<{
    id: string
    title: string
    crumbs: Breadcrumb[]
    shortVideo?: string
    shortVideoThumb?: ImageDataLike
    shortDescription: RenderRichTextData<ContentfulRichTextGatsbyReference>
    downloadLink?: FileNode & { file: { url: string } }
  }>
  studentPresentations?: object
  additionalBackground?: object
}

export interface ConceptPageProps {
  data: {
    contentfulConceptPage: ConceptPageType
  }
}

const ConceptPage = ({ data }: ConceptPageProps) => {
  const {
    title,
    slug,
    crumbs,
    video,
    videoThumb,
    description,
    linkedContent,
    studentPresentations,
    additionalBackground,
  } = data.contentfulConceptPage
  return (
    <Layout crumbs={crumbs}>
      <Seo title={title} />
      {video && (
        <Video
          url={video}
          thumb={videoThumb}
          className="my-8 mx-auto rounded shadow"
          width="640"
          height="400"
        />
      )}
      {description && (
        <div className="prose my-8 mx-auto">
          <RichText content={description} />
        </div>
      )}
      <div className="flex flex-wrap gap-8 m-8 justify-center">
        {linkedContent?.map(subpage => (
          <Card
            key={subpage.id}
            title={subpage.title}
            link={subpage.crumbs.map(c => c.slug).join("/")}
            download={subpage.downloadLink?.file.url}
            video={
              subpage.shortVideo && subpage.shortVideoThumb
                ? {
                    url: subpage.shortVideo,
                    thumb: subpage.shortVideoThumb,
                  }
                : undefined
            }
          >
            {subpage.shortDescription && (
              <RichText content={subpage.shortDescription} />
            )}
          </Card>
        ))}
      </div>
      <ConceptNav
        baseSlug={slug}
        hasStudentPresentations={!!studentPresentations}
        hasAdditionalBackground={!!additionalBackground}
        aboutAuthorMedia={data.contentfulConceptPage}
      />
    </Layout>
  )
}

export default ConceptPage
