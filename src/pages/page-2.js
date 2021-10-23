import * as React from "react"
import { Link } from "gatsby"

import Card from "../components/card"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BtnLink from "../components/btnLink"
import { StaticImage } from "gatsby-plugin-image"

const SecondPage = () => (
  <Layout>
    <Seo title="Page two" />
    <div className="text-sm font-normal text-gray-600">
      Sie sind hier: <Link to="/">Startseite</Link> / choice²learn
    </div>
    <div className="h-64 bg-primary-200 rounded shadow my-8">Konzeptvideo</div>
    <div className="prose my-8 mx-auto">
      Bei dem Unterrichtskonzet <em>choice²learn</em> überprüfen Schüler:innen
      mithilfe von Lernimpulsen eigene Vorstellungen zu naturwissenschaftlichen
      Phänomen. Dabei werden die Vorstellungen der Schüler:innen als
      gleichberechtigte Hypothesen zu den aktuellen fachwissencshaftlichen
      Vorstellungen aufgefasst. Als Ausgangspunkt dient ein alltagsnahes
      Phänomen zu dem jede/r Schüler:in eine vorstellung entwickelt, wie sich
      das beobachtete Phänom erklären lässt (z.B. Brausetablette im Wasser).
      Anschließend überprüfen die Schüler:innen in leistungsheterogenen
      Kleingruppen diese Hypothesen. Dabei führen sie Versuche durch, vollziehen
      Gedankenexperimente und arbeiten mit Modellen. Aus jedem der Lernimpulse
      lassen sich Widersprüche für eine oder mehrere Schülervorstellungen
      ableiten. Auch kann der Lernimpuls verschiedene Vorstellung stützen. Die
      Schüler:innen diskutieren ihre Erkenntnisse aus den Lernimpulsen,
      protokollieren ihre Erkenntnisse im Argumentationsbogen und bewerten diese
      anschließend. Auf diese Weise erarabeiten sie eigenständing eine
      wissenschaftliche Erklärung für das jeweilige Phänomen und lernen das
      Prinzip der Falsifikation alse wesentliches Element
      naturwissenschaftlicher Erkenntnisgewinnung anzuwenden.
    </div>
    <div className="flex flex-wrap gap-8 m-8 justify-center">
      <Card
        title="Woher kommen die Bläschen?"
        download="https://..."
        link="/page-3"
      >
        <ul>
          <li>Kontext Brausetablette</li>
          <li>Klasse 7</li>
          <li>Chemische Reaktionen (Einführung oder Wiederholung)</li>
          <li>6 Hypothesen</li>
        </ul>
      </Card>
      <Card title="Woraus bestehen die Bläschen?" download="https://...">
        Description
      </Card>
      <Card title="Lösen von Kochsalz in Wasser" download="https://...">
        Description
      </Card>
      <Card title="Verdampfen von Eugenol" download="https://...">
        Description
      </Card>
    </div>
    <div className="flex flex-wrap gap-8 justify-center place-items-center items-stretch">
      <BtnLink>Weitere Schülervorstellungen</BtnLink>
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

export default SecondPage
