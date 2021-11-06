import * as React from "react"
import Breadcrumbs from "../components/breadcrumbs"

import Layout from "../components/layout"
import Seo from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <Seo title="404: Nicht gefunden" />
    <Breadcrumbs
      crumbs={[
        { title: "Startseite", slug: "" },
        { title: "404: Nicht gefunden", slug: "" },
      ]}
    />
    <div className="prose mx-auto">
      <h1>404: Nicht gefunden</h1>
      <p>Diese Seite existiert leider nicht.</p>
    </div>
  </Layout>
)

export default NotFoundPage
