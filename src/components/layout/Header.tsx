import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

const Header = () => (
  <header className="fixed top-0 h-16 w-full z-50 bg-primary flex flex-nowrap items-center justify-between shadow">
    <a
      id="skip-to-main"
      href="#main"
      className="sr-only focus:not-sr-only block bg-white rounded"
    >
      <span className="p-2">Zum Hauptinhalt</span>
    </a>
    <a href="https://www.uni-muenster.de/Chemie.dc/">
      <StaticImage
        src="../../images/cdm-logo-white.png"
        alt="Chemie Didaktik Münster"
        height={48}
        className="m-3 no-image-transition"
        placeholder="none"
      />
    </a>
    <div
      className="text-white m-3 whitespace-nowrap overflow-hidden"
      style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="truncate">Chemie verstehen</div>
      <div style={{ marginLeft: 48 }} className="truncate">
        Unterricht erneuern
      </div>
    </div>
  </header>
)

export default Header
