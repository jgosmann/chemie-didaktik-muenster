import { graphql, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { renderRichText } from "gatsby-source-contentful/rich-text"
import * as React from "react"
import BtnLink from "../components/btnLink"
import Card from "../components/card"
import Layout from "../components/layout"
import Seo from "../components/seo"

export const query = graphql`
  query ConceptPageQuery($id: String!) {
    contentfulConceptPage(id: { eq: $id }) {
      title
      slug
      longVideo {
        secure_url
      }
      description {
        raw
      }
      linkedContent {
        id
        title
        slug
        shortVideo {
          secure_url
        }
        shortDescription {
          raw
        }
        downloadLink {
          file {
            url
          }
        }
      }
    }
  }
`

const ConceptPage = ({ data }) => {
  const {
    title,
    slug,
    longVideo,
    description,
    linkedContent,
  } = data.contentfulConceptPage
  return (
    <Layout>
      <Seo title="Page two" />
      <div className="text-sm font-normal text-gray-600">
        Sie sind hier: <Link to="/">Startseite</Link> / choice²learn
      </div>
      {longVideo && longVideo.length > 0 && (
        <video
          controls
          src={longVideo[0].secure_url}
          className="my-8 mx-auto rounded shadow"
          style={{ maxHeight: "50vh" }}
        />
      )}
      {description && (
        <div className="prose my-8 mx-auto">{renderRichText(description)}</div>
      )}
      <div className="flex flex-wrap gap-8 m-8 justify-center">
        {linkedContent?.map(subpage => (
          <Card
            key={subpage.id}
            title={subpage.title}
            link={["", slug, subpage.slug].join("/")}
            download={subpage.downloadLink?.file.url}
            video={
              subpage.shortVideo?.length > 0 && subpage.shortVideo[0].secure_url
            }
          >
            {subpage.shortDescription &&
              renderRichText(subpage.shortDescription)}
          </Card>
        ))}
      </div>
      <div className="flex flex-wrap gap-8 justify-center place-items-center items-stretch">
        <BtnLink>Weitere Schülervorstellungen</BtnLink>
        <BtnLink>Weitere Hintergründe</BtnLink>
        <BtnLink>
          <span className="inline-block overflow-hidden rounded-full align-middle shadow-md mr-2">
            <StaticImage
              src="../images/person-dummy-thumb.png"
              alt="Person XYZ"
              className="h-12 w-12"
            />
          </span>
          Person hinter dem Konzept
        </BtnLink>
        <BtnLink>FAQ</BtnLink>
      </div>
    </Layout>
  )
}

export default ConceptPage
