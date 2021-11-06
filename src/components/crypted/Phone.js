import React, { useRef } from "react"
import PropTypes from "prop-types"

import CopyButton from "./CopyButton"

const CryptedPhone = ({ country, area, block0, block1 }) => {
  const elem = useRef(null)

  const getPhone = () => {
    return (
      elem.current.getAttribute("data-country") +
      elem.current.getAttribute("data-area") +
      elem.current.getAttribute("data-block0") +
      elem.current.getAttribute("data-block1")
    )
  }

  return (
    <>
      <span
        ref={elem}
        href="#"
        data-country={country}
        data-area={area}
        data-block0={block0}
        data-block1={block1}
        className="crypted-phone"
      ></span>
      <CopyButton getCopyText={getPhone} />
    </>
  )
}

CryptedPhone.propTypes = {
  country: PropTypes.string,
  area: PropTypes.string,
  block0: PropTypes.string,
  block1: PropTypes.string,
}

export default CryptedPhone
