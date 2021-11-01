import { graphql } from "gatsby"
import {
  GatsbyImage,
  GatsbyImageProps,
  IGatsbyImageData,
  StaticImage,
} from "gatsby-plugin-image"
import * as React from "react"
import BtnLink from "./btnLink"
import FaqBtnLink from "./faqBtnLink"
import VideoBtn from "./VideoBtn"

export interface ConceptNavProps {
  baseSlug: string
  hasStudentPresentations: boolean
  hasAdditionalBackground: boolean
  aboutAuthorMedia?: {
    aboutAuthor?: Array<{ secure_url: string }>
    aboutAuthorPreview?: { title: string; gatsbyImageData: IGatsbyImageData }
  }
}

export const query = graphql`
  fragment ConceptNavAuthorMedia on ContentfulConceptPage {
    aboutAuthor {
      secure_url
    }
    aboutAuthorPreview {
      title
      gatsbyImageData(layout: FIXED, width: 42, height: 42)
    }
  }
`

const ConceptNav = ({
  baseSlug,
  hasStudentPresentations,
  hasAdditionalBackground,
  aboutAuthorMedia,
}: ConceptNavProps) => {
  const aboutAuthorVideoUrl =
    aboutAuthorMedia?.aboutAuthor &&
    aboutAuthorMedia?.aboutAuthor.length > 0 &&
    aboutAuthorMedia?.aboutAuthor[0].secure_url
  const aboutAuthorPreview = aboutAuthorMedia?.aboutAuthorPreview
  return (
    <nav className="flex flex-wrap gap-8 justify-center place-items-center items-stretch">
      {hasStudentPresentations && (
        <BtnLink to={`/${baseSlug}/weitere-schuelervorstellungen`}>
          Weitere Schülervorstellungen
        </BtnLink>
      )}
      {hasAdditionalBackground && (
        <BtnLink to={`/${baseSlug}/weitere-hintergruende`}>
          Weitere Hintergründe
        </BtnLink>
      )}
      {aboutAuthorVideoUrl && (
        <VideoBtn videoUrl={aboutAuthorVideoUrl}>
          {aboutAuthorPreview && (
            <span className="inline-block overflow-hidden rounded-full align-middle shadow-md mr-2">
              <GatsbyImage
                image={aboutAuthorPreview.gatsbyImageData}
                alt={aboutAuthorPreview.title}
              />
            </span>
          )}
          Person hinter dem Konzept
        </VideoBtn>
      )}
      <FaqBtnLink />
    </nav>
  )
}

export default ConceptNav
