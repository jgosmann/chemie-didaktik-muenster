import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Card from "../components/card"

const IndexPage = () => (
  <Layout>
    <Seo title="Home" />
    <div className="text-sm font-normal text-gray-600">
      <Link to="/" className="text-secondary-400">
        Startseite
      </Link>{" "}
      /{" "}
      <Link to="/page-2" className="text-secondary-400">
        Unterseite
      </Link>{" "}
      / Unterunterseite
    </div>
    <div className="flex flex-wrap gap-8 m-8 justify-center">
      <Card title="choice²learn">
        <ul>
          <li>Schülervorstellungen</li>
          <li>
            Weg der naturwissenschaftlichen Erkenntnisgewinnung durch
            Falsifikation
          </li>
          <li>Von der Grundschule bis in die Sek II</li>
          <li>Für hetoregene Lerngruppen</li>
        </ul>
      </Card>
      <Card
        title={
          <StaticImage
            src="../images/chemlevel.png"
            alt="chem Level"
            height={24}
          />
        }
      >
        <ul>
          <li>Sprachsensibler Unterricht</li>
          <li>Johenstone-Dreieck</li>
          <li>Differenzierung</li>
          <li>Analog und Digital</li>
          <li>Für hetoregene Lerngruppen</li>
        </ul>
      </Card>
      <Card title="One more card">Description</Card>
    </div>
  </Layout>
)

export default IndexPage
