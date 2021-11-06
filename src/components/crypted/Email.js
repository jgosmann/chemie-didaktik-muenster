import React, { useRef } from "react"
import PropTypes from "prop-types"

import CopyButton from "./CopyButton"

const CryptedEmail = ({ name, domain, tld }) => {
  const elem = useRef(null)

  const getEmail = () => {
    return (
      elem.current.getAttribute("data-name") +
      "@" +
      elem.current.getAttribute("data-domain") +
      "." +
      elem.current.getAttribute("data-tld")
    )
  }

  const onClick = ev => {
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

CryptedEmail.propTypes = {
  name: PropTypes.string,
  domain: PropTypes.string,
  tld: PropTypes.string,
}

export default CryptedEmail
