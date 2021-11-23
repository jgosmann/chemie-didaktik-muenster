import { graphql } from "gatsby"
import * as React from "react"
import Breadcrumbs from "../components/breadcrumbs"
import Card from "../components/card"
import ConceptNav from "../components/conceptNav"
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

const ConceptPage = ({ data }) => {
  const {
    title,
    slug,
    crumbs,
    video,
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
            video={subpage.shortVideo}
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
