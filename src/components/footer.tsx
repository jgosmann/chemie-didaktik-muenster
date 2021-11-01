import * as React from "react"

import wwuLogo from "../images/wwu.svg"

const Footer = () => (
  <footer className="bg-gray-400 text-gray-100 text-xs flex flex-wrap justify-around place-items-center mt-24">
    <div className="w-1/3 min-w-max box-border p-3 flex-shrink">
      <span className="uppercase font-semibold">Kontakt</span>
      <br />
      Westfälische Wilhelms-Universität Münster
      <br />
      Institut für Didaktik der Chemie
      <br />
      Fliednerstraße 21
      <br />
      48149 Münster
      <br />
      Tel.: +49 251 83-39468
      <br />
      TODO: spam protected email
    </div>
    <div className="w-1/3 min-w-max box-border p-3 text-center">
      <a
        href="https://www.uni-muenster.de/Chemie.dc/"
        className="text-gray-100 visited:text-gray-100"
      >
        https://www.uni-muenster.de/Chemie.dc/
      </a>
    </div>
    <div className="w-1/3 min-w-max box-border p-3 px-12">
      <a href="https://www.uni-muenster.de/">
        <img
          src={wwuLogo}
          alt="Logo of the WWU Münster"
          className="float-right"
        />
      </a>
    </div>
  </footer>
)

export default Footer
