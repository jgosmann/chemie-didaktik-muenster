import React from "react"
import { YoutubeConsentPopup } from "./YoutubeConsent"

export default {
  title: "Video/Youtube Consent",
  component: YoutubeConsentPopup,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
}

export const YoutubeConsent = () => <YoutubeConsentPopup />
