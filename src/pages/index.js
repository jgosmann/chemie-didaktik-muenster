import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Card from "../components/card"
import SloganCarousel from "../components/sloganCarousel"

const IndexPage = () => (
  <Layout>
    <Seo title="Home" />
    <div className="text-sm font-normal text-gray-600">
      Sie sind hier: Startseite
    </div>
    <SloganCarousel />
    <div class="prose my-8 mx-auto">
      <p>
        Herzlich Willkommen auf der Seite des Arbeitskreises von Annette Marohn!
      </p>
      <p>
        Hier finden Sie neue Unterrichtskonzepte mit Material, welches Sie
        kostenlos herunterladen und nutzen können.
      </p>
      <p>Wer wir sind und was diese Website soll erfahren Sie TODO.</p>
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
          <li>Johnestone-Dreieck</li>
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
