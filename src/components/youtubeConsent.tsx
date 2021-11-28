import React, { useCallback, useEffect, useRef } from "react"

export interface YoutubeConsentProps {
  onConsentDenied?: () => void
  onConsentGiven?: () => void
}

const YoutubeConsent = ({
  onConsentDenied,
  onConsentGiven,
}: YoutubeConsentProps) => {
  const storeConsent = useRef(null)
  const handleConsent = useCallback(() => {
    if (storeConsent.current?.checked) {
      window.sessionStorage.setItem("youtube-consent-given", "true")
    }
    onConsentGiven()
  }, [onConsentGiven])
  useEffect(() => {
    if (window.sessionStorage.getItem("youtube-consent-given") === "true") {
      onConsentGiven()
    }
  }, [onConsentGiven])

  return (
    <div className="p-4">
      <p>
        Dieser Inhalt wird von einem Drittanbieter (www.youtube.com) gehosted.
        Mit der Anzeige dieses Inhaltes stimmen Sie den{" "}
        <a href="https://www.youtube.com/t/terms" target="_blank">
          Nutzungsbedingungen
        </a>{" "}
        von www.youtube.com zu.
      </p>
      <div className="flex justify-center gap-4 my-4">
        <button className="btn primary" onClick={handleConsent}>
          Den Inhalt anzeigen
        </button>
        <button className="btn" onClick={onConsentDenied}>
          Abbrechen
        </button>
      </div>
      <div className="text-center">
        <input
          ref={storeConsent}
          type="checkbox"
          value="store"
          id="store-consent"
          className="mr-1"
        />
        <label htmlFor="store-consent">
          Diese Entscheidung bis zum Schließen des Browsers speichern.
        </label>
      </div>
    </div>
  )
}

export default YoutubeConsent
