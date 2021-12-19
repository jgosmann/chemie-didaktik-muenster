import React, { useCallback, useEffect, useRef } from "react"

export type HandleConsentCallback = ({ persist: boolean }) => void

export interface YoutubeConsentPopupProps {
  onConsentDenied?: () => void
  onConsentGiven?: HandleConsentCallback
}

export const YoutubeConsentPopup = ({
  onConsentDenied,
  onConsentGiven,
}: YoutubeConsentPopupProps) => {
  const storeConsent = useRef<HTMLInputElement>(null)
  const handleConsent = useCallback(
    () => onConsentGiven({ persist: storeConsent.current?.checked }),
    []
  )

  return (
    <div className="p-4 max-w-prose max-h-80vh overflow-scroll">
      <p>
        Dieser Inhalt wird von einem Drittanbieter (www.youtube.com) gehosted.
        Mit der Anzeige dieses Inhaltes stimmen Sie den{" "}
        <a
          href="https://www.youtube.com/t/terms"
          target="_blank"
          rel="noreferrer"
        >
          Nutzungsbedingungen
        </a>{" "}
        von www.youtube.com zu.
      </p>
      <div className="flex justify-center gap-4 m-4">
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

export interface YoutubeConsentProps {
  onConsentDenied?: () => void
  onConsentGiven?: () => void
}

const YoutubeConsent = ({
  onConsentDenied,
  onConsentGiven,
}: YoutubeConsentProps) => {
  const handleConsent = useCallback<HandleConsentCallback>(
    ({ persist }) => {
      if (persist) {
        sessionStorage.setItem("youtube-consent-given", "true")
      }
      onConsentGiven && onConsentGiven()
    },
    [onConsentGiven]
  )
  useEffect(() => {
    if (window.sessionStorage.getItem("youtube-consent-given") === "true") {
      onConsentGiven && onConsentGiven()
    }
  }, [onConsentGiven])

  return (
    <YoutubeConsentPopup
      onConsentDenied={onConsentDenied}
      onConsentGiven={handleConsent}
    />
  )
}

export default YoutubeConsent
