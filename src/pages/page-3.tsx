import * as React from "react"
import { Link } from "gatsby"

import Card from "../components/card"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BtnLink from "../components/btnLink"
import { StaticImage } from "gatsby-plugin-image"

const ThirdPage = () => (
  <Layout>
    <Seo title="Page two" />
    <div className="text-sm font-normal text-gray-600">
      Sie sind hier: <Link to="/">Startseite</Link> /{" "}
      <Link to="/page-2">choice²learn</Link> / Woher kommen die Bläschen
    </div>
    <div className="flex justify-center gap-8 flex-row-reverse flex-wrap my-8 items-start">
      <div style={{ width: 768, height: 384 }} className="rounded bg-gray-200">
        Konzeptvideo
      </div>
      <div className="prose">
        <h1>Woher kommen die Bläschen?</h1>
        <p>
          Woher kommen die Bläschen beim Lösen einer Brausetablette in Wasser?
          Das Material eignet sich für den Anfangsunterricht in der Klasse 7 als
          Einführung in die chemischen Reaktionen oder auch als Wiederholungen.
          Es werden sechs Schülervorstellungen als Hypothesen durch heterogene
          Kleingruppen überprüft. Dabei lernen die Schüler:innen, dass die
          Bläschen durch die Kombination aus Natriumhydrogencarbonat und
          Citronensäure entstehen. Sie lernen außerdem eine chemische Reaktion
          aus dem Alltag kennen und finden heraus, adss diese keine
          Aggregatszustandsänderung ist.
        </p>
        <h2>Materialdownload</h2>
        <ul>
          <li>
            <a href="">Schülermaterial</a>
          </li>
          <li>
            <a href="">Lehrerhandreichung</a>
          </li>
          <li>
            <a href="">Anleitungen</a>
          </li>
          <li>
            <a href="">Gesamtes Material</a>
          </li>
        </ul>
      </div>
    </div>
    <div className="flex flex-wrap gap-8 justify-center place-items-center items-stretch">
      <BtnLink>Versuchsvideos</BtnLink>
      <BtnLink>Weitere Hintergründe</BtnLink>
      <BtnLink>
        <span className="inline-block overflow-hidden rounded-full align-middle shadow-md mr-2">
          <StaticImage
            src="../images/person-dummy-thumb.png"
            alt="Person XYZ"
            className="h-12 w-12"
          />
        </span>
        Person hinter dem Konzept
      </BtnLink>
      <BtnLink>FAQ</BtnLink>
    </div>
  </Layout>
)

export default ThirdPage
