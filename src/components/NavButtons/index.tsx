import { graphql } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"
import * as React from "react"
import BtnLink from "../controls/BtnLink"
import FaqBtnLink from "./FaqBtnLink"
import VideoBtn from "./VideoBtn"

export interface AboutAuthorMedia {
  aboutAuthorVideo?: { youtubeId: string }
  aboutAuthorPreview?: { title: string; gatsbyImageData: IGatsbyImageData }
}

export interface NavButtonsProps {
  baseSlug: string
  hasStudentPresentations: boolean
  hasAdditionalBackground: boolean
  aboutAuthorMedia?: AboutAuthorMedia
}

export const query = graphql`
  fragment ConceptNavAuthorMedia on ContentfulConceptPage {
    aboutAuthorVideo {
      youtubeId
    }
    aboutAuthorPreview {
      title
      gatsbyImageData(layout: FIXED, width: 42, height: 42)
    }
  }
`

const NavButtons = ({
  baseSlug,
  hasStudentPresentations,
  hasAdditionalBackground,
  aboutAuthorMedia,
}: NavButtonsProps) => {
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
        <VideoBtn videoUrl={aboutAuthorMedia.aboutAuthorVideo.youtubeId}>
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

export default NavButtons
