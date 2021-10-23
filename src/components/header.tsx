import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const Header = () => (
  <header className="bg-primary-300 flex flex-nowrap items-center justify-between shadow">
    <StaticImage
      src="../images/cdm-logo.png"
      alt="Chemie Didaktik Münster"
      height={48}
      className="m-3"
    />
    <div
      className="text-white m-3"
      style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}
    >
      <div>Chemie verstehen</div>
      <div style={{ marginLeft: 48 }}>Unterricht erneuern</div>
    </div>
  </header>
)

export default Header
