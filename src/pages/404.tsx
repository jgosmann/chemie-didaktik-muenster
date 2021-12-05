import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"

const NotFoundPage = () => (
  <Layout
    crumbs={[
      { title: "Startseite", slug: "" },
      { title: "404: Nicht gefunden", slug: "" },
    ]}
  >
    <Seo title="404: Nicht gefunden" />
    <div className="prose mx-auto">
      <h1>404: Nicht gefunden</h1>
      <p>Diese Seite existiert leider nicht.</p>
    </div>
  </Layout>
)

export default NotFoundPage
