import React, { useRef } from "react"

import CopyButton from "./CopyButton"

export interface CryptedEmailProps {
  name: string
  domain: string
  tld: string
}

const CryptedEmail = ({ name, domain, tld }: CryptedEmailProps) => {
  const elem = useRef<HTMLButtonElement>(null)

  const getEmail = () => {
    if (elem?.current) {
      return (
        elem.current.getAttribute("data-name") +
        "@" +
        elem.current.getAttribute("data-domain") +
        "." +
        elem.current.getAttribute("data-tld")
      )
    }
    return ""
  }

  const onClick = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    ev.preventDefault()
    window.location.href = `mailto:${getEmail()}`
  }

  return (
    <>
      <button
        ref={elem}
        onClick={onClick}
        data-name={name}
        data-domain={domain}
        data-tld={tld}
        className="crypted-email"
        title="E-Mail schreiben"
      >
        E-Mail schreiben
      </button>
      <CopyButton getCopyText={getEmail} title="E-Mail kopieren" />
    </>
  )
}

export default CryptedEmail
