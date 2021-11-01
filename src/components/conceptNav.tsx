import { StaticImage } from "gatsby-plugin-image"
import * as React from "react"
import BtnLink from "./btnLink"
import FaqBtnLink from "./faqBtnLink"

export interface ConceptNavProps {
  baseSlug: string
  hasStudentPresentations: boolean
  hasAdditionalBackground: boolean
}

const ConceptNav = ({
  baseSlug,
  hasStudentPresentations,
  hasAdditionalBackground,
}: ConceptNavProps) => (
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
  </nav>
)

export default ConceptNav