import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const Header = () => (
  <header className="bg-primary flex flex-nowrap items-center justify-between shadow mb-4">
    <a href="https://www.uni-muenster.de/Chemie.dc/">
      <StaticImage
        src="../images/cdm-logo-white.png"
        alt="Chemie Didaktik Münster"
        height={48}
        className="m-3"
      />
    </a>
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
