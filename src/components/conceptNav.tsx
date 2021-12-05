import { graphql } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"
import * as React from "react"
import BtnLink from "./btnLink"
import FaqBtnLink from "./faqBtnLink"
import VideoBtn from "./VideoBtn"

export interface AboutAuthorMedia {
  aboutAuthorVideo?: string
  aboutAuthorPreview?: { title: string; gatsbyImageData: IGatsbyImageData }
}

export interface ConceptNavProps {
  baseSlug: string
  hasStudentPresentations: boolean
  hasAdditionalBackground: boolean
  aboutAuthorMedia?: AboutAuthorMedia
}

export const query = graphql`
  fragment ConceptNavAuthorMedia on ContentfulConceptPage {
    aboutAuthorVideo
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
      {aboutAuthorMedia?.aboutAuthorVideo && (
        <VideoBtn videoUrl={aboutAuthorMedia.aboutAuthorVideo}>
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
