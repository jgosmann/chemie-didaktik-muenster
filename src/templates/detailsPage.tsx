import { INLINES } from "@contentful/rich-text-types"
import { graphql, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { renderRichText } from "gatsby-source-contentful/rich-text"
import * as React from "react"
import Breadcrumbs from "../components/breadcrumbs"
import BtnLink from "../components/btnLink"
import FaqBtnLink from "../components/faqBtnLink"
import Layout from "../components/layout"
import Seo from "../components/seo"

export const query = graphql`
  query DetailsPageQuery($id: String!) {
    contentfulDetailsPage(id: { eq: $id }) {
      title
      slug
      longVideo {
        secure_url
      }
      description {
        raw
        references {
          contentful_id
          __typename
          file {
            url
          }
        }
      }
    }
  }
`

const DetailsPage = ({ data, pageContext: { crumbs } }) => {
  const { title, slug, longVideo, description } = data.contentfulDetailsPage
  const richTextRenderOptions = {
    renderNode: {
      [INLINES.ASSET_HYPERLINK]: ({ data }, children) => (
        <a href={data.target.file.url}>{children}</a>
      ),
    },
  }
  return (
    <Layout>
      <Seo title="Page two" />
      <Breadcrumbs crumbs={crumbs} />
      <div className="flex justify-center gap-8 flex-row-reverse flex-wrap my-8 items-start">
        {longVideo && longVideo.length > 0 && (
          <video
            controls
            src={longVideo[0].secure_url}
            className="my-8 mx-auto rounded shadow"
            style={{ maxHeight: "50vh" }}
          />
        )}
        <div className="prose">
          {description && renderRichText(description, richTextRenderOptions)}
        </div>
      </div>
      <div className="flex flex-wrap gap-8 justify-center place-items-center items-stretch">
        <BtnLink>Versuchsvideos</BtnLink>
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
        <FaqBtnLink />
      </div>
    </Layout>
  )
}

export default DetailsPage
