import React, { useRef } from "react"
import PropTypes from "prop-types"

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
      >
        E-Mail schreiben
      </button>
      <CopyButton getCopyText={getEmail} />
    </>
  )
}

export default CryptedEmail