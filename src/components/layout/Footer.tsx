import { Link } from "gatsby"
import * as React from "react"

import { DefaultCryptedEmail, DefaultCryptedPhone } from "../crypted"

const Footer = () => (
  <footer className="bg-gray-400 text-gray-100 text-xs flex flex-wrap justify-between place-items-top z-40">
    <div className="w-1/3 min-w-max box-border p-3 shrink">
      <span className="uppercase font-semibold">Kontakt</span>
      <br />
      Westfälische Wilhelms-Universität Münster
      <br />
      Institut für Didaktik der Chemie
      <br />
      Corrensstr. 48
      <br />
      48149 Münster
      <br />
      Tel.: <DefaultCryptedPhone />
      <br />
      <DefaultCryptedEmail />
    </div>
    <div className="w-1/3 min-w-max box-border p-3 text-right grow">
      <Link
        className="text-gray-100 active:text-gray-100 hover:text-gray-100 visited:text-gray-100"
        to="/datenschutzerklaerung"
      >
        Datenschutzerklärung
      </Link>
      <br />
      <a
        href="https://www.uni-muenster.de/Chemie.dc/"
        className="text-gray-100 visited:text-gray-100"
      >
        https://www.uni-muenster.de/Chemie.dc/
      </a>
    </div>
  </footer>
)

export default Footer
